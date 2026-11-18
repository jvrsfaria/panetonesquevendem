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

const ctaLinks = () => Array.from(document.querySelectorAll<HTMLAnchorElement>("a.cta"));
let scrolled: Element[] = [];

beforeEach(() => {
  scrolled = [];
  Element.prototype.scrollIntoView = function (this: Element) {
    scrolled.push(this);
  };
});

describe("Sales page CTA flow", () => {
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

  it("shows the final button right before the panetone creative with the price", () => {
    render(<Index />);
    const creative = document.querySelector(".criativo");
    const button = document.querySelector("#comprar a.cta");
    expect(button).not.toBeNull();
    expect((button?.compareDocumentPosition(creative!) ?? 0) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(creative?.textContent).toContain("19,90");
    expect(creative?.querySelectorAll("img")).toHaveLength(4);
  });
});
