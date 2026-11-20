import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// PixelPrivacy renders a router <Link>; the CTA wiring under test needs no router instance.
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const router = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...router,
    Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  };
});

import { CHECKOUT_URL } from "@/lib/checkout";
import { Index } from "@/routes/index";

vi.mock("@/lib/utmify-pixel", () => ({ startUtmifyPixel: () => () => {} }));

const ctaLinks = () => Array.from(document.querySelectorAll<HTMLAnchorElement>("a.cta"));
let scrolled: Element[] = [];

beforeEach(() => {
  scrolled = [];
  Element.prototype.scrollIntoView = function (this: Element) {
    scrolled.push(this);
  };
});

describe("Sales page CTA flow", () => {
  it("allows native checkout navigation without an advertising callback", () => {
    render(<Index />);
    const button = document.querySelector<HTMLAnchorElement>("#comprar a.cta");
    if (!button) throw new Error("Missing checkout button");
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    button.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    expect(button.href).toBe(CHECKOUT_URL);
  });

  it("keeps one checkout button and points every other button at it", () => {
    render(<Index />);
    const links = ctaLinks();
    expect(links).toHaveLength(5);
    const leaving = links.filter((link) => (link.getAttribute("href") ?? "").startsWith(CHECKOUT_URL));
    expect(leaving).toHaveLength(1);
    expect(leaving[0]?.closest("#comprar")).not.toBeNull();
    expect(links.filter((link) => link.getAttribute("href") === "#comprar")).toHaveLength(4);
  });

  it("scrolls an upper button down to the final offer and focuses its checkout", () => {
    render(<Index />);
    const hero = screen.getByRole("link", { name: /quero acessar as 15 receitas/i });
    expect(hero.getAttribute("href")).toBe("#comprar");
    fireEvent.click(hero);
    expect(scrolled).toHaveLength(1);
    expect(scrolled[0]?.id).toBe("comprar");
    expect(document.activeElement?.getAttribute("href")).toBe(CHECKOUT_URL);
  });

  it("keeps the checkout before the panetone creative", () => {
    render(<Index />);
    const creative = document.querySelector(".criativo");
    const button = document.querySelector("#comprar a.cta");
    if (!button || !creative) throw new Error("Missing final offer");
    expect(button.compareDocumentPosition(creative) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(creative?.querySelectorAll("img")).toHaveLength(4);
  });
});
