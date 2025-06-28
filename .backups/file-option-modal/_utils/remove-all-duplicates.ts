
/**
 * remove any duplicated items from the input list
 * e.g. ['a', 'b', 'a', 'c', 'b'] => ['c']
 * 
 * @param inputList 
 * @returns 
 */
export const removeAllDuplicates = (inputList: string[]): string[] => {
  const itemCount = new Map<string, number>();

  // Count occurrences of each item using forEach
  inputList.forEach((item) => {
    if (itemCount.has(item)) {
      const count = itemCount.get(item) as number;
      itemCount.set(item, count + 1);
    } else {
      itemCount.set(item, 1);
    }
  });

  return inputList.filter((item) => itemCount.get(item) === 1);
};
