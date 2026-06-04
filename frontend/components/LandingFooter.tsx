"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

export default function LandingFooter() {
  return (
    <motion.footer
      className="mt-5 border-t border-slate-500/10 py-12 text-slate-300"
      {...fadeUp}
    >
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src="/eStudy.png"
            alt="eStudy Hub"
            width={180}
            height={56}
            className="h-auto w-auto"
          />
          <p className="mt-3 max-w-md text-sm font-medium text-slate-900">
            AI-powered learning that helps students stay consistent, focused,
            and confident every day.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              className="rounded-full border border-slate-900 p-2 bg-slate-900 hover:bg-slate-500"
              aria-label="Twitter"
            >
              <FaTwitter className="text-sm" />
            </a>
            <a
              href="#"
              className="rounded-full border border-slate- 900 p-2 bg-slate-900 hover:bg-slate-500"
              aria-label="Instagram"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="#"
              className="rounded-full border border-slate-900 p-2 bg-slate-900 hover:bg-slate-500"
              aria-label="YouTube"
            >
              <FaYoutube className="text-sm" />
            </a>
            <a
              href="#"
              className="rounded-full border border-slate-900 p-2 bg-slate-900 hover:bg-slate-500"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-sm" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-emerald-600">Product</h4>
          <ul className="mt-1 space-y-2 text-sm">
            <li>
              <a href="#features" className="text-slate-900 hover:text-slate-900">
                Features
              </a>
            </li>
            <li>
              <a href="#subjects" className="text-slate-900 hover:text-slate-900">
                Subjects
              </a>
            </li>
            <li>
              <a href="#reviews" className="text-slate-900 hover:text-slate-900  ">
                Reviews
              </a>
            </li>
            <li>
              <Link href="/admin/login" className="text-slate-900 hover:text-slate-900">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-emerald-600">Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#" className="text-slate-900 hover:text-slate-900">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-900 hover:text-slate-900">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="text-slate-900 hover:text-slate-900">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-700/10 text-center pt-5 text-xs text-slate-500">
        © {new Date().getFullYear()} eStudy Hub. All rights reserved.
      </div>
    </motion.footer>
  );
}
