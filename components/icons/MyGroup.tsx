export default function MyGroup({ className }: { className?: string }) {
   return (
      <svg
         width="512"
         height="512"
         x="0"
         y="0"
         viewBox="0 0 512 512"
         className={className}
         fill="currentColor"
      >
         <g>
            <path
               d="M135.667 467.333c0-33.321-27.012-60.333-60.333-60.333S15 434.012 15 467.333V497h120.667v-29.667zM316.333 467.333C316.333 434.012 289.321 407 256 407s-60.333 27.012-60.333 60.333V497h120.667v-29.667zM497 467.333C497 434.012 469.988 407 436.667 407s-60.333 27.012-60.333 60.333V497H497v-29.667z"
               stroke="#ffffff"
               strokeWidth="25"
            ></path>
            <circle cx="75.333" cy="369.167" r="37.833" stroke="#ffffff" strokeWidth="25"></circle>
            <circle cx="256" cy="369.167" r="37.833" stroke="#ffffff" strokeWidth="25"></circle>
            <circle cx="256" cy="52.833" r="37.833" stroke="#ffffff" strokeWidth="25"></circle>
            <circle cx="436.667" cy="369.167" r="37.833" stroke="#ffffff" strokeWidth="25"></circle>
            <path
               d="M316.333 180.667V151c0-33.321-27.012-60.333-60.333-60.333S195.667 117.679 195.667 151v29.667M406 180.667v90H106v-90M61 180.667h390"
               stroke="#ffffff"
               strokeWidth="25"
            ></path>
         </g>
      </svg>
   )
}
