const links = {
  home: "/",
  createJourney: "/journey",
  search: "/search",
  askGuides: "/ask-guides",
  blog: "/blog",
  contactUs: "/contact-us",
  login: "/signin",
  signup: "/signup",
  dashboard: "/dashboard",
};

export default links;

export const linkArray = [
  {
    href: links.createJourney,
    name: "create your journey",
  },
  {
    href: links.askGuides,
    name: "ask our guides",
  },
  {
    href: links.blog,
    name: "blog",
  },
  {
    href: links.contactUs,
    name: "contact us",
  },
];

export const linkClassName =
  "transition-colors ease-in-out duration-300 label-m-bold uppercase hover:text-orange";
