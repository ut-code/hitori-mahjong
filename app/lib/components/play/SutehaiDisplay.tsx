import { For } from "solid-js";
import type { Hai } from "@/lib/core/types/hai";
import { HaiImage } from "./HaiImage";

export function SutehaiDisplay(props: { sutehai: Hai[] }) {
  return (
    <div>
      <h3 class="text-sm md:text-base mb-1 text-yellow-300">捨て牌</h3>
      <div class="grid grid-cols-6 gap-0 h-36 md:h-44 content-start bg-[#0F2918] rounded-md p-1 border border-[#1A472A] w-[13rem] md:w-[16rem]">
        <For each={props.sutehai}>{(hai) => <HaiImage hai={hai} />}</For>
      </div>
    </div>
  );
}
