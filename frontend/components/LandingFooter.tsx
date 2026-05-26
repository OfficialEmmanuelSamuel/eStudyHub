"use client";

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
      className="border-t border-white/10 py-12 text-slate-300"
      {...fadeUp}
    >
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-white">eStudy Hub</h3>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            AI-powered learning that helps students stay consistent, focused,
            and confident every day.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              className="rounded-full border border-white/15 p-2 hover:bg-white/10"
              aria-label="Twitter"
            >
              <FaTwitter className="text-sm" />
            </a>
            <a
              href="#"
              className="rounded-full border border-white/15 p-2 hover:bg-white/10"
              aria-label="Instagram"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="#"
              className="rounded-full border border-white/15 p-2 hover:bg-white/10"
              aria-label="YouTube"
            >
              <FaYoutube className="text-sm" />
            </a>
            <a
              href="#"
              className="rounded-full border border-white/15 p-2 hover:bg-white/10"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="text-sm" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Product</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#features" className="hover:text-white">
                Features
              </a>
            </li>
            <li>
              <a href="#subjects" className="hover:text-white">
                Subjects
              </a>
            </li>
            <li>
              <a href="#reviews" className="hover:text-white">
                Reviews
              </a>
            </li>
            <li>
              <Link href="/admin/login" className="hover:text-white">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-5 text-xs text-slate-500">
        © {new Date().getFullYear()} eStudy Hub. All rights reserved.
      </div>
    </motion.footer>
  );
}
