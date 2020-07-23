import { useState } from "react";
import { shuffle } from "lodash";

export function useShuffled<T>(data: T[], shouldShuffle: boolean): T[] {
  return useState(shouldShuffle ? shuffle(data) : data)[0];
}
