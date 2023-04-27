import { readFile } from "fs/promises";
import path from "path";
import { ZodError, z } from "zod";
import * as cheerio from "cheerio";

const ArgsSchema = z.tuple([
  z.string().transform((val, ctx) => {
    const filePath = path.resolve(val);
    const dataDir = path.resolve("./data");
    if (!filePath.startsWith(dataDir)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be in './data'",
        fatal: true
      });

      return z.NEVER;
    }

    if (!/\d{4}(-\d{2}){5}\/index\.html$/.test(filePath)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File must be index.html in data dir",
        fatal: true
      });

      return z.NEVER;
    }

    return filePath;
  })
]);

async function main(args: z.output<typeof ArgsSchema>) {
  const fileContent = await readFile(args[0], "utf-8");
  const $ = cheerio.load(fileContent);
  const links = $("ul.list > li a.clearfix");
  links.each((_, link) => {
    if (typeof link.attribs.href == "string") {
      const url = new URL(link.attribs.href, "https://webview.fate-go.us/");
      console.log(url.toString());
    }
  });
}

try {
  const args: unknown[] = process.argv.slice(2);
  const res = ArgsSchema.parse(args);
  main(res);
} catch (e: unknown) {
  if (e instanceof ZodError) {
    e.errors.forEach(error => {
      console.error("error -", error.message, `at argument ${error.path}`);
    });

    process.exit(1);
  }

  throw e;
}
