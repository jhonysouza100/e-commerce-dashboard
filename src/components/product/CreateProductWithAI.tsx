import { RiGeminiLine } from "@remixicon/react";
import { useProductsContext } from "./context/useProductsContext";

interface AIResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason: string;
    avgLogprobs: number;
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
    promptTokensDetails: {
      modality: string;
      tokenCount: number;
    }[];
    candidatesTokensDetails: {
      modality: string;
      tokenCount: number;
    }[];
  };
  modelVersion: string;
  responseId: string;
}

function extractJson(text: string) {
  try {
    const jsonStartIndex = text.indexOf('{');
    const jsonEndIndex = text.lastIndexOf('}') + 1;

    if (jsonStartIndex === -1 || jsonEndIndex === 0) {
      return null; // No JSON found
    }

    const jsonString = text.substring(jsonStartIndex, jsonEndIndex);
    const json = JSON.parse(jsonString);
    return json;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

function CreateProductWithAI() {
  const { product, setProduct } = useProductsContext();

  const handleClick = async () => {
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": "AIzaSyDqku7PpMN44Sp5mjDUteb95vM4qud2X8g",
        },
        body: JSON.stringify({
          contents: [
        {
          parts: [
            {
          text: `export enum ProductCategoryEnum {
      GAMES = 'Games',
      SMARTPHONES = 'Smartphones',
      INFORMATICA = 'Informatica',
      ELECTRONICS = 'Electronicos',
      ELECTRODOMESTICS = 'Electrodomesticos',
      BEAUTY = 'Perfumeria & Cosmeticos',
      BEBIDAS = 'Bebidas & Cigarros',
      SPORTS = 'Deportes & Fitness',
      FASHION = 'Ropas & Calzados',
      HOME = 'Hogar & Jardin',
      CAMPING = 'Pesaca y Camping',
      TOYS = 'Juguetes & Coleccionables',
      HEALTH = 'Salud & Bienestar',
      AUTOMOTIVE = 'Automotriz',
      OTHER = 'other',
        }

        export interface Product {
      name: string;
      description: string;
      specifications: { label: string, value: string }[]
      category: ProductCategoryEnum;
      brand: string;
      model: string;
      images: [];
        }

        Ten en cuenta la interface de Product para responder solamente con un json completando los campos para el nombre de producto: ${product?.name as string}, su descripcion, caracteristicas, su categoria segun el enum, etc.`,
            },
          ],
        },
          ],
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch from Gemini API");
        return;
      }

      const data: AIResponse = await response.json();
      const productData = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (productData) {
        try {
          const parsedProduct = extractJson(productData);
          console.log(parsedProduct)
          setProduct(parsedProduct);
        } catch (error) {
          console.error("Failed to parse product data:", error);
        }
      } else {
        console.error("No product data received from API");
      }
    } catch (error) {
      console.error("Error fetching data from Gemini API:", error);
    }
  };

  return (
    <div
      onClick={handleClick} 
      className="absolute right-10 top-1/2 -translate-y-1/2 text-primary hover:text-secondary bg-white rounded-md p-1 shadow">
      <RiGeminiLine size={12} />
    </div>
  );
}

export default CreateProductWithAI;
