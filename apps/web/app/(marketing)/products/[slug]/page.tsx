import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductCategory, productCategories } from "@/content/product-categories";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) {
    return { title: "Products" };
  }
  return {
    title: category.title,
    description: category.description,
  };
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getProductCategory(slug);
  if (!category) {
    notFound();
  }
  const others = productCategories.filter((item) => item.slug !== category.slug);
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-brand-green">Products</Link>
        <span className="px-2">/</span>
        {category.title}
      </p>
      <div className="mt-6 overflow-hidden rounded-3xl border border-border shadow-card">
        <img src={category.hero.src} alt={category.hero.alt} className="h-56 w-full object-cover sm:h-80" />
      </div>
      <h1 className="mt-10 font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
        {category.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-foreground/60">{category.body}</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {category.photos.map((photo) => (
          <figure key={photo.src} className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
            <img src={photo.src} alt={photo.alt} className="aspect-[16/10] w-full object-cover" />
            <figcaption className="px-4 py-3 text-sm font-medium text-foreground/70">{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <Link href="/contact" className="mt-10 inline-flex rounded-xl bg-brand-green px-6 py-3 font-semibold text-white">
        Ask about this category
      </Link>
      <div className="mt-14 border-t border-border pt-8">
        <h2 className="font-heading text-lg font-bold text-foreground">Other categories</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {others.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/products/${item.slug}`}
                className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground/80 hover:border-brand-blue/40 hover:text-brand-green"
              >
                {item.navLabel}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
