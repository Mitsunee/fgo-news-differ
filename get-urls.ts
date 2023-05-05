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
        message: "Path must be in './data'",
        fatal: true
      });

      return z.NEVER;
    }

    if (!/\d{4}(-\d{2}){5}\/?$/.test(filePath)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Path must be directory using '%F-%H-%M-%S' name pattern",
        fatal: true
      });

      return z.NEVER;
    }

    return filePath;
  })
]);

type LinkCollection = cheerio.Cheerio<cheerio.Element>;
// prettier-ignore
async function getLinksByPath(filePath: string, failHard: true): Promise<LinkCollection>;
// prettier-ignore
async function getLinksByPath(filePath: string, failHard?: undefined): Promise<LinkCollection | undefined>;
async function getLinksByPath(filePath: string, failHard?: true) {
  try {
    const fileContent = await readFile(filePath, "utf-8");
    const $ = cheerio.load(fileContent);
    return $("ul.list > li a.clearfix");
  } catch (e) {
    if (failHard) {
      console.error(`Error while trying to get links from '${filePath}'`);
      throw e;
    }
    return;
  }
}

function printLinkAsURL(_: number, link: cheerio.Element) {
  if (typeof link.attribs.href == "string") {
    const url = new URL(link.attribs.href, "https://webview.fate-go.us");
    console.log(url.toString());
  }
}

async function main(args: z.output<typeof ArgsSchema>) {
  const [newsLinks, maintenanceLinks, updateLinks] = await Promise.all([
    getLinksByPath(path.join(args[0], "index.html"), true),
    getLinksByPath(path.join(args[0], "maintenance.html")),
    getLinksByPath(path.join(args[0], "updates.html"))
  ]);
  newsLinks.each(printLinkAsURL);
  maintenanceLinks?.each(printLinkAsURL);
  updateLinks?.each(printLinkAsURL);
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
