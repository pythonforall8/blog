import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="w-[95%] mx-auto py-4 sm:py-4 ">
      <div className="p-8 bg-background/60 backdrop-blur-[2px] rounded-2xl">
        {/* Logo and Title Section */}
        <div className="flex justify-center items-center">
          <Link href="#" className="flex items-center font-bold">
            <Image
              src="/pfa_logo.ico"
              alt="PythonForAll Logo"
              width={36}
              height={36}
              className="mr-2"
            />
            <h3 className="text-2xl">PythonForAll</h3>
          </Link>
        </div>
        <Separator className="my-6" />
        {/* Footer Text and Links */}
        <section className="flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
          <div>
            <h3>&copy; 2025 PythonForAll. All rights reserved.</h3>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/terms" className="hover:underline text-primary">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:underline text-primary">
              Privacy Policy
            </Link>
          </div>
        </section>
      </div>
    </footer>
  );
};
