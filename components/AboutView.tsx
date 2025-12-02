import React from 'react';
import { 
  Cpu, Heart, Search, ScanSearch, Tags, BrainCircuit, BookOpen, 
  Database, FileCode, Binary, Layers, MessageSquare, ListOrdered 
} from 'lucide-react';

const AboutView: React.FC = () => {
  const steps = [
    {
      title: "1. Data Ingestion",
      description: "Load large-scale book metadata (descriptions, ISBNs, categories) and structure everything into a Pandas DataFrame for downstream processing.",
      icon: Database,
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-blue-600 group-hover:border-blue-500 group-hover:shadow-blue-100",
      textClass: "group-hover:text-blue-700"
    },
    {
      title: "2. Data Pre-Processing",
      description: "Clean descriptions (remove stopwords, trim whitespace), validate ISBNs, remove duplicates, and prepare final cleaned descriptions for embedding.",
      icon: FileCode,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-slate-600 group-hover:border-slate-500 group-hover:shadow-slate-100",
      textClass: "group-hover:text-slate-700"
    },
    {
      title: "3. Embedding Generation",
      description: "Generate 384-dimensional semantic vectors using sentence-transformers/all-MiniLM-L6-v2. Apply L2 normalization to ensure stable cosine similarity.",
      icon: Binary,
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-emerald-600 group-hover:border-emerald-500 group-hover:shadow-emerald-100",
      textClass: "group-hover:text-emerald-700"
    },
    {
      title: "4. Vector Database Construction",
      description: "Initialize ChromaDB, configure cosine similarity metric, and persist the collection (IDs, documents, embeddings) to disk for future retrieval.",
      icon: Layers,
      image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-indigo-600 group-hover:border-indigo-500 group-hover:shadow-indigo-100",
      textClass: "group-hover:text-indigo-700"
    },
    {
      title: "5. Query Understanding",
      description: "Accept user’s natural-language query and convert it into a normalized vector using the same MiniLM model used for ingestion.",
      icon: MessageSquare,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-violet-600 group-hover:border-violet-500 group-hover:shadow-violet-100",
      textClass: "group-hover:text-violet-700"
    },
    {
      title: "6. Semantic Retrieval",
      description: "Perform a cosine similarity search in ChromaDB to retrieve top-k most relevant book vectors and extract corresponding metadata.",
      icon: ScanSearch,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-cyan-600 group-hover:border-cyan-500 group-hover:shadow-cyan-100",
      textClass: "group-hover:text-cyan-700"
    },
    {
      title: "7. Zero-Shot Category Classification",
      description: "Use facebook/bart-large-mnli for multi-label classification to predict categories (Fiction, Non-fiction, etc.) for each retrieved book.",
      icon: Tags,
      image: "https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-amber-600 group-hover:border-amber-500 group-hover:shadow-amber-100",
      textClass: "group-hover:text-amber-700"
    },
    {
      title: "8. Sentiment / Emotional Tone Analysis",
      description: "Use j-hartmann/emotion-english-distilroberta-base to compute emotion distribution (joy, sadness, fear, etc.) and filter by user preference.",
      icon: BrainCircuit,
      image: "https://images.unsplash.com/photo-1516382799247-87df95d790b7?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-rose-600 group-hover:border-rose-500 group-hover:shadow-rose-100",
      textClass: "group-hover:text-rose-700"
    },
    {
      title: "9. Multi-Objective Ranking",
      description: "Combine scores from semantic similarity, category alignment, and sentiment preference to compute a final weighted ranking score.",
      icon: ListOrdered,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-fuchsia-600 group-hover:border-fuchsia-500 group-hover:shadow-fuchsia-100",
      textClass: "group-hover:text-fuchsia-700"
    },
    {
      title: "10. Output Recommendation",
      description: "Return the final curated list of books with metadata (title, author, description) and explain why they fit the specific request.",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
      colorClass: "group-hover:text-slate-800 group-hover:border-slate-800 group-hover:shadow-slate-200",
      textClass: "group-hover:text-slate-900"
    }
  ];

  return (
    <div className="animate-slide-up max-w-5xl pb-20 px-1 lg:px-0 pt-4 lg:pt-12">
      <div className="flex items-end gap-4 mb-10 pl-2 border-b border-slate-100 pb-6">
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-900">About Readowl</h2>
        <span className="text-slate-400 font-medium pb-1.5 text-base">v1.0</span>
      </div>

      {/* Intro Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-xl text-slate-700 font-serif leading-relaxed mb-6">
            Readowl is an AI-powered book discovery engine designed to help you find your next great read based on not just genre, but specific topics and emotional resonance.
          </p>
          <p className="text-slate-500 leading-relaxed">
            Traditional search engines rely on keywords. Readowl understands the <em>feeling</em> of a story. Whether you want something "suspenseful set in space" or "happy and heartwarming about baking", our AI librarian curates a personalized shelf just for you.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-violet-50 p-6 rounded-3xl flex-1 border border-violet-100 flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                <Cpu className="text-violet-600" size={24} />
                <h3 className="font-bold text-slate-900">Powered by Gemini</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">Leveraging Google's advanced language models for deep semantic understanding.</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                <Cpu size={120} />
            </div>
          </div>
          <div className="bg-rose-50 p-6 rounded-3xl flex-1 border border-rose-100 flex flex-col justify-center relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                <Heart className="text-rose-600" size={24} />
                <h3 className="font-bold text-slate-900">Made for Readers</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">Crafted with love for bookworms who cherish the magic of storytelling.</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                <Heart size={120} />
            </div>
          </div>
        </div>
      </div>

      {/* Technical Roadmap */}
      <div className="bg-white rounded-[40px] p-6 lg:p-12 shadow-sm border border-slate-100">
        <h3 className="text-xl lg:text-2xl font-serif font-bold text-slate-900 mb-12 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">🛠️</span>
          Technical Roadmap
        </h3>

        <div className="relative pl-4 lg:pl-10">
          {/* Connecting Line */}
          <div className="absolute left-[24px] lg:left-[63px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative flex flex-col sm:flex-row gap-6 lg:gap-8 mb-16 group last:mb-0">
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-slate-400 transition-all duration-500 shadow-sm group-hover:scale-110 ${step.colorClass}`}>
                  <Icon size={24} className="lg:w-7 lg:h-7" />
                </div>
                <div className="flex-1 pt-1 lg:pt-3">
                  <div className="flex flex-col-reverse lg:flex-row lg:items-start justify-between gap-4">
                      <div>
                        <h4 className={`text-lg lg:text-xl font-bold text-slate-800 mb-2 transition-colors ${step.textClass}`}>
                          {step.title}
                        </h4>
                        <p className="text-slate-500 leading-relaxed max-w-lg text-sm lg:text-base">
                            {step.description}
                        </p>
                      </div>
                      <img 
                        src={step.image} 
                        alt={step.title} 
                        className="w-full lg:w-32 h-32 lg:h-24 object-cover rounded-xl shadow-sm opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutView;