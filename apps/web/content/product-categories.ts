export type CategoryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export type ProductCategory = {
  slug: string;
  title: string;
  navLabel: string;
  description: string;
  body: string;
  hero: CategoryPhoto;
  photos: CategoryPhoto[];
};

export const productCategories: ProductCategory[] = [
  {
    slug: "consumer-drones",
    title: "Consumer drones",
    navLabel: "Consumer drones",
    description:
      "Drone products for personal and recreational use. Ask TravelGuards LLC what can be sourced before you order.",
    body: "These photos show the kinds of consumer drones customers ask about. They are examples of the category, not a list of models in stock, and they do not include prices or specifications.",
    hero: {
      src: "/photos/hero-flight.jpg",
      alt: "Consumer drone flying over open water",
      caption: "In flight",
    },
    photos: [
      { src: "/photos/drone-forest.jpg", alt: "Light-colored consumer drone in flight", caption: "Outdoor flight" },
      { src: "/photos/drone-trees.jpg", alt: "Small drone flying among trees", caption: "Compact drones" },
      { src: "/photos/drone-snow.jpg", alt: "Consumer drone flying over a pale landscape", caption: "Camera drones" },
      { src: "/photos/drone-overhead.jpg", alt: "Drone and controller viewed from above", caption: "Drone and controller" },
      { src: "/photos/drone-studio.jpg", alt: "Folded drone with a controller and batteries", caption: "Ready to pack" },
    ],
  },
  {
    slug: "accessories",
    title: "Drone accessories",
    navLabel: "Accessories",
    description:
      "Controllers, mounts, and other supporting items. Compatibility is confirmed for the specific product before an order.",
    body: "Accessories depend on the drone they are meant to work with. The photos below illustrate the kinds of items we can discuss. They are not a promise that a particular accessory is available or compatible.",
    hero: {
      src: "/photos/controller-phone.jpg",
      alt: "Remote controller with a phone mounted on it",
      caption: "Controller mounts",
    },
    photos: [
      { src: "/photos/controller-tablet.jpg", alt: "Controller holding a tablet", caption: "Screen mounts" },
      { src: "/photos/controller-table.jpg", alt: "Drone remote controller on a table", caption: "Remote controllers" },
      { src: "/photos/controller-hands.jpg", alt: "Person holding a drone controller outdoors", caption: "Handheld controllers" },
      { src: "/photos/accessory-case.jpg", alt: "Organized pouches for small accessories", caption: "Cases and pouches" },
      { src: "/photos/controller-pair.jpg", alt: "Two handheld controllers side by side", caption: "Controller styles" },
    ],
  },
  {
    slug: "components",
    title: "Replacement components",
    navLabel: "Components",
    description:
      "Replacement parts and small components, when they can be obtained for a request. This is not a parts catalog.",
    body: "If you need a replacement piece, tell us the product it belongs to. We confirm what can be sourced. These photos show the kinds of components customers ask about, not items listed for immediate sale.",
    hero: {
      src: "/photos/parts.jpg",
      alt: "Drone with small replacement parts nearby",
      caption: "Small parts",
    },
    photos: [
      { src: "/photos/drone-table.jpg", alt: "Folded drones and loose parts on a work table", caption: "Parts with the aircraft" },
      { src: "/photos/kit-flatlay.jpg", alt: "Drones, controllers, batteries, and small parts laid out together", caption: "Kit pieces" },
      { src: "/photos/drone-studio.jpg", alt: "Drone shown with supporting pieces", caption: "Supporting pieces" },
    ],
  },
  {
    slug: "batteries",
    title: "Batteries & charging",
    navLabel: "Batteries & charging",
    description:
      "Drone batteries and charging accessories, subject to the safety and shipping rules that apply to those products.",
    body: "Battery and charger requests are handled one product at a time. Shipping and handling follow the rules for that item. These photos illustrate the category. They are not a stock list or a compatibility chart.",
    hero: {
      src: "/photos/charger-hand.jpg",
      alt: "Hand holding a multi-battery charger",
      caption: "Charging hubs",
    },
    photos: [
      { src: "/photos/battery.jpg", alt: "Drone battery on a bench", caption: "Flight batteries" },
      { src: "/photos/charger-hub.jpg", alt: "Battery charging hub", caption: "Chargers" },
      { src: "/photos/gear-table.jpg", alt: "Spare batteries next to a folded drone and controller", caption: "Spare packs" },
      { src: "/photos/case-kit.jpg", alt: "Packed case with battery pouches", caption: "Packed for travel" },
    ],
  },
  {
    slug: "related-electronics",
    title: "Related electronics",
    navLabel: "Related electronics",
    description:
      "Other consumer electronics and merchandise when they are part of a request TravelGuards LLC can fulfill.",
    body: "Related electronics are discussed only when they fit a customer request. The photos show the kinds of supporting gear people ask about alongside drones. They are not a store catalog.",
    hero: {
      src: "/photos/solar.jpg",
      alt: "Portable solar charger with a cable attached",
      caption: "Portable power",
    },
    photos: [
      { src: "/photos/picnic-kit.jpg", alt: "Drones, controllers, and batteries set out together", caption: "Gear used together" },
      { src: "/photos/case-kit.jpg", alt: "Organized case of cables, batteries, and a drone pouch", caption: "Cables and storage" },
      { src: "/photos/controller-tablet.jpg", alt: "Controller with a mounted screen", caption: "Screens and mounts" },
    ],
  },
];

export function getProductCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((category) => category.slug === slug);
}
