import { useLocation } from "react-router";
import { Link } from "react-router";
import BasicRule from "../lib/components/BasicRule";
import LocalRule from "../lib/components/LocalRule";

export default function Page() {
  const location = useLocation();
  const currentHash = location.hash;
  const contents = ["basic", "local"];
  return (
    <div className="drawer drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ml-4 mt-4">
        <div id="basic">
          <BasicRule />
        </div>
        <div id="local">
          <LocalRule />
        </div>
      </div>

      <div className="hidden md:block drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="is-drawer-close:w-14 is-drawer-open:w-48 bg-gray-100 flex flex-col items-start min-h-full">
          <ul className="menu w-full grow">
            {contents.map((content) => {
              if (currentHash === `#${content}`) {
                return (
                  <li key={content}>
                    <span className="is-drawer-close:hidden text-green-500 bg-base-300">
                      <Link to={`#${content}`}>
                        {content.charAt(0).toUpperCase() + content.slice(1)}{" "}
                        Rules
                      </Link>
                    </span>
                  </li>
                );
              } else {
                return (
                  <li key={content}>
                    <span className="is-drawer-close:hidden">
                      <Link to={`#${content}`}>
                        {content.charAt(0).toUpperCase() + content.slice(1)}{" "}
                        Rules
                      </Link>
                    </span>
                  </li>
                );
              }
            })}
          </ul>
          <div
            className="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Open"
          >
            <label
              htmlFor="my-drawer-4"
              className="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
                className="inline-block size-4 my-1.5"
              >
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
              </svg>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
