import splashSrc from "~/assets/images/splash.avif";

export function Splash() {
  return (
    <body className="min-h-dvh overflow-x-hidden bg-[#0A101A] antialiased">
      <main className="flex h-dvh w-full flex-col items-center justify-center bg-[#0A101A]">
        <img
          src={splashSrc}
          alt="Tools for a better web — Remix Engineering Soft Wear"
          width={1107}
          height={865}
          className="w-full max-w-[550px] object-cover"
        />
        <h1 className="font-mono text-base text-white uppercase">
          Available May 19
        </h1>
      </main>
    </body>
  );
}
