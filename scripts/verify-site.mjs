import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";

// Run against an existing local preview: SITE_URL=http://localhost:4001 npm test
const base = process.env.SITE_URL || "http://127.0.0.1:4000";
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const captureScreenshots = process.env.SCREENSHOTS === "1";
if (captureScreenshots) mkdirSync(".validation", { recursive: true });
const internalLinks = new Set();
try {
  // Discover published pages so adding content does not require editing this list.
  const sitemap = await page.request.get(base + "/sitemap.xml");
  assert.equal(sitemap.status(), 200, "sitemap loads");
  const routes = Array.from(
    (await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g),
    ([, url]) => new URL(url).pathname,
  );
  assert.ok(routes.length > 0, "sitemap contains page routes");
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const response = await page.goto(base + route);
      assert.equal(response.status(), 200, `${route} loads`);
      const isChinese = route.startsWith("/zh/");
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        isChinese ? "zh-CN" : "en",
      );
      const otherLanguagePath = isChinese
        ? route.replace(/^\/zh/, "")
        : `/zh${route}`;
      await expect(
        page
          .locator(".language-switch a")
          .filter({ hasText: isChinese ? "EN" : "中" }),
      ).toHaveAttribute("href", otherLanguagePath);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("main").count(), 1);
      assert.ok((await page.locator("h1").count()) >= 1);
      if (["/", "/about/", "/zh/", "/zh/about/"].includes(route)) {
        await expect(page.locator(".timeline-row")).toHaveCount(4);
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, `${route} fits ${width}px`);
      const images = await page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((img) => img.complete && img.naturalWidth === 0)
            .map((img) => img.src),
        );
      assert.deepEqual(images, [], `${route} has no broken images`);
      // Scroll lazy images into view even when screenshots are disabled.
      for (const img of await page.locator("img").all()) {
        if (!(await img.isVisible())) continue;
        await img.scrollIntoViewIfNeeded();
        await expect(img).toHaveJSProperty("complete", true);
        assert.ok(await img.evaluate((image) => image.naturalWidth > 0));
      }
      assert.equal(
        (await page.locator("main").innerText()).includes("{%"),
        false,
        `${route} renders legacy figures`,
      );
      if (width === 1440) {
        const links = await page
          .locator("a[href]")
          .evaluateAll((links) =>
            links.map((link) => link.getAttribute("href")),
          );
        for (const link of links) {
          if (link.startsWith("/") && !link.startsWith("//"))
            internalLinks.add(link.split("#")[0]);
          if (link.startsWith("#") && link.length > 1)
            assert.ok(
              await page.evaluate(
                (id) => !!document.getElementById(id),
                decodeURIComponent(link.slice(1)),
              ),
              `${route}: ${link} exists`,
            );
        }
      }
      if (
        captureScreenshots &&
        (width === 1440 || width === 390) &&
        ["/", "/blogs/", "/about/", "/blogs/Causality/", "/projects/"].includes(
          route,
        )
      ) {
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        await page.screenshot({
          path: `.validation/${route.replaceAll("/", "-") || "home"}-${width}.png`,
          fullPage: true,
        });
      }
    }
  }
  // Untranslated headings must keep their English typography on Chinese pages.
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const headings = [];
    for (const route of ["/", "/zh/"]) {
      await page.goto(base + route);
      headings.push(
        await page.locator(".hero h1").evaluate((heading) => {
          const style = getComputedStyle(heading);
          return {
            text: heading.textContent.replace(/\s+/g, " ").trim(),
            font: style.fontFamily,
            size: style.fontSize,
            leading: style.lineHeight,
            spacing: style.letterSpacing,
          };
        }),
      );
    }
    if (headings[0].text === headings[1].text) {
      assert.deepEqual(
        headings[1],
        headings[0],
        `English hero typography at ${width}px`,
      );
    }
  }
  await page.goto(base + "/blogs/");
  const allEssayCount = await page.locator("[data-essay]").count();
  const searchMatchCount = await page
    .locator('[data-search*="causality"]')
    .count();
  assert.ok(searchMatchCount > 0, "search fixture exists");
  await page.getByRole("searchbox").fill("causality");
  assert.equal(
    await page.locator("[data-essay]:visible").count(),
    searchMatchCount,
  );
  await page.getByRole("searchbox").fill("no-such-essay-xyz");
  assert.equal(await page.locator("#empty-state").isVisible(), true);
  await page.getByRole("searchbox").fill("");
  const categoryMatchCount = await page
    .locator('[data-essay][data-category="Systems & philosophy"]')
    .count();
  await page.getByRole("button", { name: "Systems & philosophy" }).click();
  assert.equal(
    await page.locator("[data-essay]:visible").count(),
    categoryMatchCount,
  );
  await page.getByRole("button", { name: "All writing" }).click();
  assert.equal(
    await page.locator("[data-essay]:visible").count(),
    allEssayCount,
  );
  for (const details of await page.locator(".wechat details").all()) {
    await details.locator("summary").click();
    await expect(details).toHaveAttribute("open", "");
    await expect(details.locator("img")).toBeVisible();
    await expect(details.locator("img")).toHaveJSProperty("complete", true);
    assert.ok(
      await details.locator("img").evaluate((img) => img.naturalWidth > 0),
    );
  }
  await page.goto(base + "/blogs/General-puepose-skill/");
  await page.waitForURL("**/blogs/General-purpose-skill/");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "Copy link" }).click();
  await expect(page.getByRole("button", { name: "Link copied" })).toBeVisible();
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    page.url(),
  );
  await page.goto(base + "/zh/blogs/");
  await page.getByRole("searchbox").fill("因果");
  assert.ok(
    (await page.locator("[data-essay]:visible").count()) > 0,
    "Chinese search finds translated titles",
  );
  await page.getByRole("searchbox").fill("");
  await page.getByRole("button", { name: "系统与哲学" }).click();
  assert.ok(
    (await page.locator("[data-essay]:visible").count()) > 0,
    "Chinese category filters work",
  );
  await page.goto(base + "/zh/projects/ReconDrive/");
  await expect(page.locator(".prose")).toHaveAttribute("lang", "zh-CN");
  await page
    .locator(".language-switch")
    .getByRole("link", { name: "EN", exact: true })
    .click();
  await page.waitForURL("**/projects/ReconDrive/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  for (const link of internalLinks)
    assert.equal(
      (await page.request.get(base + link)).status(),
      200,
      `Internal link: ${link}`,
    );
  for (const route of ["/feed.xml", "/sitemap.xml", "/robots.txt"])
    assert.equal((await page.request.get(base + route)).status(), 200);
  assert.deepEqual(errors, [], "no browser JavaScript errors");
  console.log(
    `PASS: ${routes.length} routes at 4 widths, internal links, heading anchors, images, filters, search, QR disclosure, clipboard, legacy redirect, RSS, sitemap, and browser errors.`,
  );
} finally {
  await browser.close();
}
