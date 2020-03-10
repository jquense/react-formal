import styled from 'astroturf';
import { Link } from 'gatsby';
import React, { useState } from 'react';
import { Navbar } from '@docpocalypse/gatsby-theme';
import useGlobalListener from '@restart/hooks/useGlobalListener';
import Logo from '../components/Logo';

const HeroLink = styled(Link, { allowAs: true })`
  color: white;

  &:hover,
  &:active,
  &:focus {
    color: darken(white, 5%);
  }
`;

function SplashPageLayout(props) {
  const [stuck, setStuck] = useState(false);

  useGlobalListener(
    'scroll',
    () => {
      setStuck(window.scrollY !== 0);
    },
    { passive: true },
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        css="transition: background-color 300ms; position: fixed;"
        bg={!stuck ? 'bg-transparent' : 'bg-primary'}
      />
      <main className="flex flex-col">
        <div className="px-4 text-white bg-primary relative">
          <svg
            viewBox="0 0 700 400"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute block"
            css="height: 100%; left: 50%; transform: translateX(-50%);"
          >
            <path
              d="M349.884 874.72L-.003.006h699.772L349.884 874.72z"
              // fill="#fff"
              className="fill-current text-accent"
              // fillOpacity=".07"
            />
          </svg>
          <div className="mt-navbar" />
          <div className="mx-auto container py-24 flex items-center flex-col relative z-10 ">
            <h1 className="m-0 flex text-6xl mb-5 w-full">
              <span className="flex-1 text-right">React</span>
              <Logo className="mx-4" />
              <span className="flex-1">Formal</span>
            </h1>
            <p className="text-2xl">Classy HTML form management</p>
            <div className="flex whitespace-no-wrap  mt-3">
              <Link
                to="/getting-started/"
                className="px-3 font-bold tracking-wide text-white hover:text-gray-400 flex-1"
              >
                Get started
              </Link>
              <Link
                to="/api/Form"
                className="px-3 font-bold tracking-wide text-white hover:text-gray-400 flex-1"
              >
                API docs
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-gray-50">
          <div className="mx-auto px-4 container text-center grid-flow-row grid md:grid-cols-3 w-128 md:w-auto gap-12 py-16">
            <div className="mb-0 flex flex-col">
              <h2>Sophisticated</h2>
              <p className="flex-1">
                An API that can deftly handle every use case; from the simple
                forms to exceedly complex ones.
              </p>
            </div>
            <div className="flex flex-col">
              <h2>Eloquent</h2>
              <p className="flex-1">
                An expressive API for modeling simple to complex transformations
                and validations with ease.
              </p>
            </div>

            <div className="flex flex-col">
              <h2>Deferential</h2>
              <p className="flex-1">
                Gives you complete control of how your forms look. Use any
                components or ui framework you wish.
              </p>
            </div>
          </div>
        </div>
        {/* <div className="bg-accent text-gray-100 flex-1">
          <div className="mx-auto container">{props.children}</div>
        </div> */}
      </main>
      <footer className="bg-primary flex-1 relative overflow-hidden text-gray-600 flex flex-col">
        <svg
          viewBox="0 730 700 400"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute block"
          css="top:0; left: 50%; transform: translateX(-50%);"
        >
          <path
            d="M349.884 874.72L-.003.006h699.772L349.884 874.72z"
            className="fill-current text-accent"
          />
        </svg>
        <div className="mx-auto container text-center grid grid-cols-3 gap-12 z-10 relative pt-12 pb-8">
          {/* <div className="grid grid-cols-1 gap-6">
            <Link
              to="/api/Form"
              className="pr-2 text-white hover:text-gray-300"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/jquense/react-formal"
              className="text-white hover:text-gray-50"
            >
              Github
            </a>
          </div> */}
        </div>
        <div className="text-xs mt-auto self-center  z-10">
          bowtie icon by Nicole Hammonds from the Noun Project
        </div>
      </footer>
    </div>
  );
}

export default SplashPageLayout;
