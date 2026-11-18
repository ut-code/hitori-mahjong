import type { Hai } from "@/lib/core/types/hai";

export function HaiImage(props: { hai: Hai; class?: string }) {
  return (
    <img
      src={`/hai/${props.hai.kind}_${props.hai.value}.png`}
      alt={`${props.hai.kind} ${props.hai.value}`}
      class={props.class ?? "w-8 h-11 md:w-10 md:h-14"}
    />
  );
}
