import { describe, it, expect } from "vitest";
import { isShareApi, isShareMutationApi, isShareRoute } from "./share";

describe("isShareRoute", () => {
  it("matches top-level share routes", () => {
    expect(isShareRoute("/tunes")).toBe(true);
    expect(isShareRoute("/tunes/abc")).toBe(true);
    expect(isShareRoute("/saved")).toBe(true);
    expect(isShareRoute("/profile/joe")).toBe(true);
    expect(isShareRoute("/forums/general")).toBe(true);
    expect(isShareRoute("/games/forza-horizon-5")).toBe(true);
  });

  it("matches blog/guideline new-post sub-routes", () => {
    expect(isShareRoute("/blog/new")).toBe(true);
    expect(isShareRoute("/guideline/new")).toBe(true);
  });

  it("does not match calculator / read-only content", () => {
    expect(isShareRoute("/")).toBe(false);
    expect(isShareRoute("/calculator")).toBe(false);
    expect(isShareRoute("/blog")).toBe(false);
    expect(isShareRoute("/blog/some-post-id")).toBe(false);
    expect(isShareRoute("/guideline")).toBe(false);
    expect(isShareRoute("/guideline/some-id")).toBe(false);
    expect(isShareRoute("/login")).toBe(false);
    expect(isShareRoute("/register")).toBe(false);
    expect(isShareRoute("/settings")).toBe(false);
  });

  it("does not partial-match unrelated paths starting with similar prefix", () => {
    expect(isShareRoute("/tunescape")).toBe(false);
    expect(isShareRoute("/profilesomething")).toBe(false);
  });
});

describe("isShareApi", () => {
  it("matches share API prefixes", () => {
    expect(isShareApi("/api/tunes")).toBe(true);
    expect(isShareApi("/api/tunes/abc/upvote")).toBe(true);
    expect(isShareApi("/api/saves")).toBe(true);
    expect(isShareApi("/api/forum/posts")).toBe(true);
    expect(isShareApi("/api/search")).toBe(true);
  });

  it("does not match non-share APIs", () => {
    expect(isShareApi("/api/auth/me")).toBe(false);
    expect(isShareApi("/api/blog/posts")).toBe(false);
    expect(isShareApi("/api/guideline/posts")).toBe(false);
    expect(isShareApi("/api/webhooks/stripe")).toBe(false);
  });
});

describe("isShareMutationApi", () => {
  it("matches blog/guideline mutation routes", () => {
    expect(isShareMutationApi("/api/blog/posts")).toBe(true);
    expect(isShareMutationApi("/api/blog/comments")).toBe(true);
    expect(isShareMutationApi("/api/guideline/posts")).toBe(true);
    expect(isShareMutationApi("/api/guideline/comments")).toBe(true);
  });

  it("does not match read or unrelated APIs", () => {
    expect(isShareMutationApi("/api/blog/posts/abc")).toBe(false);
    expect(isShareMutationApi("/api/tunes")).toBe(false);
    expect(isShareMutationApi("/api/auth/me")).toBe(false);
  });
});
