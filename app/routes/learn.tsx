import { createFileRoute, Link, useLocation } from "@tanstack/solid-router";
import { createEffect, For } from "solid-js";
import BasicRule from "@/lib/components/learn/BasicRule";
import LocalRule from "@/lib/components/learn/LocalRule";

export const Route = createFileRoute("/learn")({
  component: Page,
});

const CONTENTS = [
  { id: "basic", label: "基本ルール" },
  { id: "local", label: "ローカルルール" },
] as const;

function Page() {
  const location = useLocation();
  const currentHash = () => location().hash;

  createEffect(currentHash, (hash) => {
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div class="drawer drawer-open bg-[#1A472A] font-serif text-white">
      <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content ml-4 mr-4 mt-4">
        <Link
          to="/"
          class="mb-4 bg-yellow-600 rounded text-xs w-1/2 max-w-30 h-7 flex items-center justify-center transition-transform duration-150 hover:scale-105 text-white"
        >
          ホームに戻る
        </Link>
        <div id="basic">
          <BasicRule />
        </div>
        <div id="local">
          <LocalRule />
        </div>
      </div>
      <div class="hidden md:block drawer-side is-drawer-close:overflow-visible">
        <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay" />
        <div class="is-drawer-close:w-14 is-drawer-open:w-48 bg-[#0F2918] flex flex-col items-start min-h-full text-white">
          <ul class="menu w-full grow">
            <For each={CONTENTS}>
              {(content) => (
                <li>
                  <Link
                    to="/learn"
                    hash={content.id}
                    class={`is-drawer-close:hidden ${
                      currentHash() === content.id ? "text-yellow-400" : ""
                    }`}
                  >
                    {content.label}
                  </Link>
                </li>
              )}
            </For>
          </ul>

          <div class="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
            <label
              for="my-drawer-4"
              class="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                fill="none"
                stroke="currentColor"
                class="inline-block size-4 my-1.5"
                role="img"
                aria-label="toggle icon"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M9 4v16" />
                <path d="M14 10l2 2l-2 2" />
              </svg>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
