import React from 'react';

function IconButton(props) {
  return (
    <a href="#" role="button" className="px-4 mt-2 font-bold" {...props}>
      <span aria-hidden>{props.children}</span>
    </a>
  );
}

export default IconButton;
