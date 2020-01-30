import { promisify } from "util";

import { Encoding } from "./encoding";
import { BPE } from "./models";
import { Tokenizer } from "./tokenizer";

// jest.mock('../bindings/tokenizer');
// jest.mock('../bindings/models', () => ({
//   __esModule: true,
//   Model: jest.fn()
// }));

// Or:
// jest.mock('../bindings/models', () => {
//   return require('../bindings/__mocks__/models');
// });

// const TokenizerMock = mocked(Tokenizer);

describe("Tokenizer", () => {
  it("has expected methods", () => {
    const model = BPE.empty();
    const tokenizer = new Tokenizer(model);

    expect(typeof tokenizer.addSpecialTokens).toBe("function");
    expect(typeof tokenizer.addTokens).toBe("function");
    expect(typeof tokenizer.decode).toBe("function");
    expect(typeof tokenizer.decodeBatch).toBe("function");
    expect(typeof tokenizer.disablePadding).toBe("function");
    expect(typeof tokenizer.disableTruncation).toBe("function");
    expect(typeof tokenizer.encode).toBe("function");
    expect(typeof tokenizer.encodeBatch).toBe("function");
    expect(typeof tokenizer.getDecoder).toBe("function");
    expect(typeof tokenizer.getNormalizer).toBe("function");
    expect(typeof tokenizer.getPostProcessor).toBe("function");
    expect(typeof tokenizer.getPreTokenizer).toBe("function");
    expect(typeof tokenizer.getVocabSize).toBe("function");
    expect(typeof tokenizer.idToToken).toBe("function");
    expect(typeof tokenizer.runningTasks).toBe("function");
    expect(typeof tokenizer.setDecoder).toBe("function");
    expect(typeof tokenizer.setModel).toBe("function");
    expect(typeof tokenizer.setNormalizer).toBe("function");
    expect(typeof tokenizer.setPadding).toBe("function");
    expect(typeof tokenizer.setPostProcessor).toBe("function");
    expect(typeof tokenizer.setPreTokenizer).toBe("function");
    expect(typeof tokenizer.setTruncation).toBe("function");
    expect(typeof tokenizer.tokenToId).toBe("function");
    expect(typeof tokenizer.train).toBe("function");
  });

  describe("addTokens", () => {
    it("accepts a list of string as new tokens when initial model is empty", () => {
      const model = BPE.empty();
      const tokenizer = new Tokenizer(model);

      const nbAdd = tokenizer.addTokens(["my", "name", "is", "john", "pair"]);
      expect(nbAdd).toBe(5);
    });
  });

  describe("encode", () => {
    let tokenizer: Tokenizer;
    let encode: (sequence: string, pair: string | null) => Promise<Encoding>;

    beforeEach(() => {
      // Clear all instances and calls to constructor and all methods:
      // TokenizerMock.mockClear();

      const model = BPE.empty();
      tokenizer = new Tokenizer(model);
      tokenizer.addTokens(["my", "name", "is", "john", "pair"]);
      encode = promisify(tokenizer.encode.bind(tokenizer));
    });

    it("accepts a pair of strings as parameters", async () => {
      const encoding = await encode("my name is john", "pair");
      expect(encoding).toBeDefined();
    });

    it("accepts a string with a null pair", async () => {
      const encoding = await encode("my name is john", null);
      expect(encoding).toBeDefined();
    });

    it("returns an Encoding", async () => {
      const encoding = await encode("my name is john", "pair");

      expect(encoding.getAttentionMask()).toEqual([1, 1, 1, 1, 1]);

      const ids = encoding.getIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids).toHaveLength(5);
      for (const id of ids) {
        expect(typeof id).toBe("number");
      }

      expect(encoding.getOffsets()).toEqual([
        [0, 2],
        [2, 6],
        [6, 8],
        [8, 12],
        [12, 16]
      ]);
      expect(encoding.getOverflowing()).toBeUndefined();
      expect(encoding.getSpecialTokensMask()).toEqual([0, 0, 0, 0, 0]);
      expect(encoding.getTokens()).toEqual(["my", "name", "is", "john", "pair"]);
      expect(encoding.getTypeIds()).toEqual([0, 0, 0, 0, 1]);
    });
  });
});
