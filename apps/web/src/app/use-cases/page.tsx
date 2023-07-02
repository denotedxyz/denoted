import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  buttonVariants,
  cn,
} from "@denoted/ui";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmailSignup } from "../../components/EmailSignup";
import { Logo } from "../../components/Logo";
import { COMMANDS } from "../../components/commands";

export const metadata: Metadata = {
  title: "denoted",
  description: "Your data at your /command",
};

type Example = {
  title: string;
  description: string;
  cid: string;
};

export const USE_CASE_EXAMPLES: Example[] = [
  {
    title: "Envision your Blockchain News and Product Updates", // Momoka
    cid: "QmUr5sygQ8tG8wkVS3EaMn2JvB83nsj1deQeFkA8ack8na",
    description:
      "Seamlessly compose your insights on our platform and share them with the global crypto community. Join the conversation and share your expertise on emerging web3 technologies.",
  },
  {
    title: "Elevate your Blockchain Analytics", // USDC
    description:
      "Our platform fosters an effortless exploration into your blockchain analytics. Craft your analyses and visualize them in a user-friendly environment while engaging with others interested in similar web3 narratives.",
    cid: "QmaEZ6NmcpMSDDVzv4cS2Qm8ybd8Vt6AJYkxxHFGg7ZWhd",
  },
  {
    title: "Enhance your DAO proposals", // ENS
    cid: "QmQJzywKkrS5AC7dEAiSsx8mvsWbBHxHW5dJxiqSkMSdKo",
    description:
      "Our platform is designed to support you in creating impactful DAO proposals. Write, refine, and publish while retaining full ownership of your data and ideas.",
  },
];

// type Props = (Example & { page: DeserializedPage })[];

export default async function Page() {
  const examples = await Promise.all(
    USE_CASE_EXAMPLES.map(async (example) => {
      const response = await fetch(
        `https://cloudflare-ipfs.com/ipfs/${example.cid}`,
        {
          cache: "force-cache",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Could not fetch page from IPFS with CID ${example.cid}`
        );
      }

      const json = await response.json();

      return {
        ...example,
        page: json,
      };
    })
  );

  return (
    <>
      <div className="m-auto flex md:max-w-6xl flex-col items-start gap-12 md:gap-24 p-4 pb-32">
        <header className="flex w-full items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href={{
              pathname: "/create",
            }}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Open App
            {" ->"}
          </Link>
        </header>
        <div className="flex flex-col w-full gap-4 md:gap-8">
          <h1 className="max-w-4xl leading-tight text-[1.75rem] md:text-6xl font-bold">
            Own your digital creations through the power of decentralization
          </h1>
          <p className="max-w-3xl">
            {`Embrace the future of content creation with our innovative web3
            knowledge management editor. We are redefining what it means to write in
            the decentralized era, where data ownership, transparency, and user
            experience converge. Unleash your potential in a platform where your
            words, your control, and your privacy come first. It's time to own
            your narrative in Web3.`}
          </p>
          <div className="flex gap-2">
            <Link href="/create" className={cn(buttonVariants({}))}>
              Try now {"->"}
            </Link>
            <Link
              href="https://t.me/+21U-bg0SJAM2MmI0"
              className={cn(buttonVariants({ variant: "link" }))}
              target="_blank"
            >
              Join telegram
            </Link>
          </div>
        </div>
        <section className="flex w-full flex-col gap-12 md:gap-8">
          {examples.map((example, i) => {
            const isEven = i % 2 === 0;
            return (
              <article
                className={cn(
                  "flex flex-col md:flex-row max-w-full items-center gap-4 md:gap-12"
                )}
              >
                <div
                  className={cn(
                    "w-full md:w-1/2",
                    isEven ? "md:order-first" : "md:order-last"
                  )}
                >
                  <h1 className="mb-2 md:mb-4 leading-tight text-2xl md:text-5xl font-semibold">
                    {example.title}
                  </h1>
                  <p>{example.description}</p>
                </div>
                <div
                  className={cn(
                    "flex aspect-square w-full md:w-1/2 overflow-scroll rounded-2xl border shadow-md"
                  )}
                >
                  <div className="w-full scale-75">
                    <h1 className="mb-8 text-4xl md:text-5xl font-bold leading-tight">
                      {example.page.title}
                    </h1>
                    {/* <Viewer
                      json={{
                        type: "doc",
                        content: example.page.data ?? [],
                      }}
                    /> */}
                  </div>
                </div>
              </article>
            );
          })}
          <div className="md:mt-8 flex flex-col items-center gap-2">
            <h2 className="text-xl md:text-2xl">View more examples</h2>
            <Link
              href="/explore"
              target="_blank"
              className={cn(buttonVariants({}))}
            >
              Examples {"->"}
            </Link>
          </div>
        </section>
        <section className="flex w-full flex-col gap-8">
          <h1 className="text-2xl md:text-5xl font-semibold">Plugins</h1>
          {COMMANDS.map((group) => {
            return (
              <article key={group.name}>
                <h1 className="mb-2 text-lg">{group.name}</h1>
                <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {group.items.map((command) => {
                    return (
                      <li key={command.command}>
                        <Card className="h-full">
                          <CardHeader className="p-3 md:p-6">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-md md:text-lg">
                                {command.title}
                              </CardTitle>{" "}
                              {command.icon && (
                                <Image
                                  {...command.icon}
                                  width={16}
                                  height={16}
                                  alt={"Icon for command"}
                                  className="inline"
                                />
                              )}
                            </div>
                            <CardDescription>
                              {command.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-3 md:p-6">
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant={"outline"}
                                className="text-[0.6rem] md:text-xs w-auto font-mono"
                              >
                                /{command.command}
                              </Badge>
                              <Badge
                                variant={"outline"}
                                className="text-[0.6rem] md:text-xs w-auto"
                              >
                                {command.blockType}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </section>
        <section className="flex w-full flex-col gap-8">
          <h1 className="text-2xl md:text-5xl font-semibold">
            Stay up to date
          </h1>
          <EmailSignup />
        </section>
      </div>
    </>
  );
}
