import cn from 'classnames';
import React from 'react';

function Logo(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 25"
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      css="width: 100px"
      className={cn(props.className, 'text-primary inline-block')}
      fill="currentColor"
    >
      <path
        d="M10 25L20 0h-3.5C14.095 3.124 5.911 3.058 4 0H0l10 25z"
        fill="#fff"
      />
      <path
        d="M18.5 4.862c0-1.186-.299-2.475-.796-3.475-.08-.17-.299-.254-.518-.237-2.29.305-4.539 1.17-5.852 2.288a.511.511 0 01-.339.119h-1.97a.525.525 0 01-.339-.119C7.352 2.32 5.123 1.472 2.814 1.15c-.22-.017-.438.068-.518.237-.497 1-.796 2.289-.796 3.475h.08v.034-.034H1.5c0 1.356.299 2.509.796 3.526.08.17.299.271.518.254 2.309-.305 4.538-1.153 5.852-2.271a.511.511 0 01.339-.119h1.99c.14 0 .26.051.339.119 1.313 1.118 3.543 1.966 5.852 2.271a.515.515 0 00.518-.254c.497-1.017.796-2.17.796-3.526v.034-.034z"
        fill="#1f222b"
        fillRule="nonzero"
      />
    </svg>
  );
}

export default Logo;
