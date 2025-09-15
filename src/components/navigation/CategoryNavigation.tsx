"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { Category } from "@/generated/prisma";
import { cn } from "@/lib/utils";

interface CategoryNavigationProps {
  categories: Category[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export function CategoryNavigation({ 
  categories, 
  className,
  title = "Shop by Category",
  subtitle = "Explore our product categories"
}: CategoryNavigationProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="group hover:shadow-lg transition-all">
              <Link href={`/products?category=${category.id}`}>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    {/* Icon placeholder */}
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    
                    {/* Category name */}
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    {/* View products link */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 mx-auto text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/products">
              <Package className="mr-2 h-4 w-4" />
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
