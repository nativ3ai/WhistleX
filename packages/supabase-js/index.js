class SupabaseError extends Error {
  constructor(message, info = {}) {
    super(message);
    this.name = "SupabaseError";
    Object.assign(this, info);
  }
}

class SupabaseClient {
  constructor(url, key, options = {}) {
    this.url = url?.replace(/\/$/, "") ?? "";
    this.key = key ?? "";
    this.globalHeaders = options.headers ?? {};
    this.fetchImpl = (options.fetch ?? globalThis.fetch)?.bind(globalThis) ?? null;
    if (!this.fetchImpl) {
      throw new Error("Fetch API is not available in this environment");
    }
  }

  from(table) {
    return new SupabaseQueryBuilder(this, table);
  }

  async rpc(fnName, params) {
    return this._request(`/rest/v1/rpc/${fnName}`, {
      method: "POST",
      body: params ?? {},
      headers: { "Content-Type": "application/json" },
    });
  }

  async _request(path, { method = "GET", headers = {}, body, query, expectSingle = false }) {
    const base = this.url || "";
    const url = new URL(path, base.startsWith("http") ? base : `https://${base}`);
    if (query) {
      for (const [key, value] of query.entries()) {
        url.searchParams.append(key, value);
      }
    }

    const finalHeaders = {
      apikey: this.key,
      Authorization: this.key ? `Bearer ${this.key}` : undefined,
      "Content-Type": body !== undefined ? "application/json" : undefined,
      ...this.globalHeaders,
      ...headers,
    };

    Object.keys(finalHeaders).forEach((key) => {
      if (finalHeaders[key] === undefined) {
        delete finalHeaders[key];
      }
    });

    const response = await this.fetchImpl(url.toString(), {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 204) {
      return { data: null, error: null };
    }

    let data = null;
    let text;
    try {
      text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch (parseError) {
      return {
        data: null,
        error: new SupabaseError("Failed to parse Supabase response", { details: String(parseError) }),
      };
    }

    if (!response.ok) {
      const message = data?.message || response.statusText || "Supabase request failed";
      return {
        data: null,
        error: new SupabaseError(message, {
          details: data?.details,
          hint: data?.hint,
          code: data?.code ?? String(response.status),
        }),
      };
    }

    if (expectSingle && Array.isArray(data)) {
      if (data.length === 1) {
        return { data: data[0], error: null };
      }
      if (data.length === 0) {
        return {
          data: null,
          error: new SupabaseError("No rows returned", { code: "PGRST116" }),
        };
      }
      return {
        data: null,
        error: new SupabaseError("Multiple rows returned", { code: "PGRST117" }),
      };
    }

    return { data, error: null };
  }
}

class SupabaseQueryBuilder {
  constructor(client, table) {
    this.client = client;
    this.table = table;
    this.method = "GET";
    this.body = undefined;
    this.query = new URLSearchParams();
    this.headers = new Map();
    this.expectSingle = false;
    this.executedPromise = null;
  }

  insert(values) {
    this.method = "POST";
    this.body = Array.isArray(values) ? values : [values];
    this._appendPrefer("return=representation");
    return this;
  }

  update(values) {
    this.method = "PATCH";
    this.body = values;
    this._appendPrefer("return=representation");
    return this;
  }

  select(columns = "*") {
    this.query.set("select", columns);
    if (this.method === "GET") {
      this._appendPrefer("return=representation");
    }
    return this;
  }

  eq(column, value) {
    this.query.set(column, `eq.${value}`);
    return this;
  }

  order(column, options = {}) {
    const direction = options.ascending === false ? "desc" : "asc";
    this.query.append("order", `${column}.${direction}`);
    return this;
  }

  single() {
    this.expectSingle = true;
    this._appendPrefer("return=representation");
    this._appendPrefer("single");
    return this._execute(true);
  }

  then(onfulfilled, onrejected) {
    return this._execute().then(onfulfilled, onrejected);
  }

  catch(onrejected) {
    return this._execute().catch(onrejected);
  }

  finally(onfinally) {
    return this._execute().finally(onfinally);
  }

  _appendPrefer(value) {
    if (!value) return;
    const existing = this.headers.get("Prefer");
    if (existing) {
      const parts = new Set(existing.split(","));
      parts.add(value);
      this.headers.set("Prefer", Array.from(parts).join(","));
    } else {
      this.headers.set("Prefer", value);
    }
  }

  _execute(forceSingle = false) {
    if (!this.executedPromise) {
      const headers = {};
      for (const [key, value] of this.headers.entries()) {
        headers[key] = value;
      }
      const path = `/rest/v1/${this.table}`;
      const body = this.body;
      if (Array.isArray(body) && this.method !== "POST") {
        this.body = body[0];
      }
      this.executedPromise = this.client._request(path, {
        method: this.method,
        headers,
        body: this.method === "GET" ? undefined : this.body,
        query: this.query,
        expectSingle: forceSingle || this.expectSingle,
      });
    }
    return this.executedPromise;
  }
}

export function createClient(url, key, options = {}) {
  return new SupabaseClient(url, key, options);
}

export { SupabaseError };

export default { createClient };
