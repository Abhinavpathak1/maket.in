(() => {
  const categories = [
    {
      name: "Electronics",
      items: [
        "Wireless headphones", "Bluetooth speaker", "Smart watch", "4K television", "Mirrorless camera",
        "Gaming laptop", "Mechanical keyboard", "Wireless mouse", "Portable charger", "Noise-cancelling earbuds"
      ],
      price: 1899,
      image: "photo-1498049794561-7780e7231661"
    },
    {
      name: "Fashion",
      items: [
        "Classic cotton tee", "Everyday sneakers", "Canvas backpack", "Linen shirt", "Minimalist watch",
        "Leather crossbody bag", "Denim jacket", "Running shoes", "Everyday sunglasses", "Soft knit sweater"
      ],
      price: 799,
      image: "photo-1441986300917-64674bd600d8"
    },
    {
      name: "Home",
      items: [
        "Ceramic table lamp", "Cotton cushion set", "Oak side table", "Pour-over coffee set", "Soft throw blanket",
        "Glass storage jars", "Desk organiser", "Indoor planter", "Bamboo serving tray", "Scented candle set"
      ],
      price: 599,
      image: "photo-1616486338812-3dadae4b4ace"
    },
    {
      name: "Beauty",
      items: [
        "Daily face cleanser", "Hydrating face cream", "Botanical shampoo", "Daily sunscreen SPF 50", "Nourishing hair oil",
        "Body lotion", "Gentle face serum", "Aloe vera gel", "Cleansing balm", "Lip care set"
      ],
      price: 349,
      image: "photo-1596462502278-27bfdc403348"
    },
    {
      name: "Books",
      items: [
        "The mindful morning", "Designing a better life", "The little garden guide", "Stories from the coast", "Everyday cooking",
        "A practical guide to focus", "The creative habit", "A walk through history", "Small space living", "The quiet adventure"
      ],
      price: 299,
      image: "photo-1544947950-fa07a98d237f"
    }
  ];

  const products = categories.flatMap((category, groupIndex) =>
    category.items.map((name, index) => ({
      id: `demo-${String(groupIndex * 10 + index + 1).padStart(3, "0")}`,
      name,
      category: category.name,
      description: `A customer favourite from our ${category.name.toLowerCase()} collection, selected for everyday quality and value.`,
      price: category.price + index * 137 + groupIndex * 211,
      rating: Number((4.1 + ((index + groupIndex) % 9) / 10).toFixed(1)),
      reviews: 24 + index * 37 + groupIndex * 19,
      image: `https://images.unsplash.com/${category.image}?auto=format&fit=crop&w=720&q=80`,
      badge: index % 3 === 0 ? "Popular pick" : ""
    }))
  );

  const orderStatuses = ["Delivered", "Shipped", "Processing", "Delivered", "Out for delivery"];
  const orders = products.map((product, index) => ({
    id: `MK-${String(2026001 + index).padStart(7, "0")}`,
    productId: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    status: orderStatuses[index % orderStatuses.length],
    date: new Date(Date.UTC(2026, 8, 30 - index)).toISOString().slice(0, 10)
  }));

  const faqTopics = [
    ["Where is my order?", "Open Your Orders to see the latest tracking and delivery updates."],
    ["How can I return an item?", "Choose the item from Your Orders and follow the return instructions shown there."],
    ["How do I update my address?", "Visit Your Account and update your saved delivery details before placing an order."],
    ["When will I receive my refund?", "Refund timing depends on your payment provider; the order page shows the current status."],
    ["How do I cancel an order?", "Open Your Orders. Eligible orders include a cancel option while they are still processing."]
  ];
  const faqs = Array.from({ length: 50 }, (_, index) => {
    const topic = faqTopics[index % faqTopics.length];
    return {
      id: `faq-${index + 1}`,
      question: index < faqTopics.length ? topic[0] : `${topic[0].replace("?", "")} (${index + 1})?`,
      answer: topic[1]
    };
  });

  window.MarketDemoData = { products, orders, faqs };
})();
