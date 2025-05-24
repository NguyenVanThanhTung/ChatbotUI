 async function getHighlightColor(productName) {
    try {
      const response = await fetch(`http://localhost:8000/lookup_product?product_name=${encodeURIComponent(productName)}`);
      const data = await response.json();
      console.log(data)
      return data.color || 'red'; // fallback to red if no color is returned
    } catch (error) {
      console.error('Error getting highlight color:', error);
      return 'red'; // fallback to red on error
    }
}

getHighlightColor("cream")