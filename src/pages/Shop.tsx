import { useState, useMemo, Fragment } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, Query, limit, startAfter, DocumentSnapshot, QueryDocumentSnapshot, QueryConstraint } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import ProductCard from "@/components/ProductCard";
import { categories, Product } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PAGE_LIMIT = 8;

const fetchProducts = async ({ pageParam = null, queryKey }: { pageParam?: QueryDocumentSnapshot | null, queryKey: (string | null)[] }): Promise<{ products: Product[], lastVisible: QueryDocumentSnapshot | null }> => {
  const [_key, category, sortBy] = queryKey;
  
  const constraints: QueryConstraint[] = [];

  // Category filter
  if (category !== "All Products") {
    constraints.push(where("category", "==", category));
  }

  // Sorting
  switch (sortBy) {
    case "price-low":
      constraints.push(orderBy("price", "asc"));
      break;
    case "price-high":
      constraints.push(orderBy("price", "desc"));
      break;
    case "rating":
      constraints.push(orderBy("rating", "desc"));
      break;
    default: // featured
      constraints.push(orderBy("featured", "desc"));
      break;
  }

  // Add pagination cursors
  constraints.push(limit(PAGE_LIMIT));
  if (pageParam) {
    constraints.push(startAfter(pageParam));
  }

  const productsQuery = query(collection(db, "products"), ...constraints);
  const querySnapshot = await getDocs(productsQuery);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });

  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { products, lastVisible };
};

const fetchAllProductsForSearch = async (): Promise<Product[]> => {
  // This query fetches all products without pagination for client-side search.
  // For very large catalogs, a dedicated search service like Algolia is recommended.
  const productsQuery = collection(db, "products");
  const querySnapshot = await getDocs(productsQuery);
  const products: Product[] = [];
  querySnapshot.forEach((doc) => {
    products.push({ id: doc.id, ...doc.data() } as Product);
  });
  return products;
};

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [sortBy, setSortBy] = useState("featured");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['products', selectedCategory, sortBy],
    queryFn: fetchProducts,
    initialPageParam: null as QueryDocumentSnapshot | null,
    getNextPageParam: (lastPage) => {
      return lastPage.lastVisible ?? undefined;
    },
    // Disable fetching when a search query is active to allow client-side filtering on all items
    enabled: !searchQuery,
  });

  // A separate query to fetch all products when a search is active.
  const { data: allProductsForSearch, isLoading: isSearchLoading } = useQuery<Product[]>({
    queryKey: ['products', 'all_for_search'],
    queryFn: fetchAllProductsForSearch,
    enabled: !!searchQuery, // Only run this query when searchQuery is not empty
  });

  // Paginated products for browsing
  const paginatedProducts = useMemo(() => data?.pages.flatMap(page => page.products) ?? [], [data]);

  const filteredProducts = useMemo(() => {
    if (searchQuery) {
      if (!allProductsForSearch) return [];
      return allProductsForSearch.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return paginatedProducts;
  }, [paginatedProducts, allProductsForSearch, searchQuery]);


  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Shop Digital Products</h1>
      {searchQuery && (
        <p className="text-muted-foreground text-lg mb-8">Showing results for: <span className="text-primary font-semibold">"{searchQuery}"</span> <Link to="/shop" className="text-sm underline ml-2">Clear</Link></p>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {status === 'pending' || isSearchLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : status === 'error' ? (
        <div className="text-center py-20">
          <p className="text-xl text-destructive">Error: {error.message}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length === 0 && !isFetching && (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No products found {searchQuery ? `for "${searchQuery}"` : 'in this category'}.</p>
            </div>
          )}
          {/* Hide pagination controls when searching */}
          {!searchQuery && (
            <div className="mt-12 text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
                size="lg"
              >
                {isFetchingNextPage ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading more...</>
                ) : hasNextPage ? (
                  'Load More'
                ) : (
                  'Nothing more to load'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;