import React from "react";

export default function Nav() {
  return (
    <header className="relative py-4 md:py-6">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/"><img src="logos/murmur.png" alt="logo" className="w-1/2" /></a>
          </div>

        </div>
      </div>
    </header>
  );
}
