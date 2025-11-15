export function buildPoolAccessControlConditions(poolAddress: string) {
  return [
    {
      conditionType: "evmContract",
      contractAddress: poolAddress,
      chain: "base",
      functionName: "isUnlocked",
      functionParams: [],
      functionAbi: {
        name: "isUnlocked",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "bool" }]
      },
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true"
      }
    },
    {
      operator: "and"
    },
    {
      conditionType: "evmContract",
      contractAddress: poolAddress,
      chain: "base",
      functionName: "canDecrypt",
      functionParams: [":userAddress"],
      functionAbi: {
        name: "canDecrypt",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [{ name: "", type: "bool" }]
      },
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true"
      }
    }
  ] as const;
}
