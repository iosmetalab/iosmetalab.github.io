
import { useState } from "react";
import { Search, Download, Calendar, Users, HardDrive, Filter, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Torrent {
  id: string;
  name: string;
  size: string;
  seeders: number;
  leechers: number;
  uploadDate: string;
  category: string;
  magnetLink: string;
  uploader: string;
}

const mockTorrents: Torrent[] = [
  {
    id: "1",
    name: "Ubuntu 22.04.3 Desktop amd64.iso",
    size: "4.7 GB",
    seeders: 1250,
    leechers: 45,
    uploadDate: "2024-05-20",
    category: "Software",
    magnetLink: "magnet:?xt=urn:btih:example1",
    uploader: "ubuntu-official"
  },
  {
    id: "2",
    name: "Blender 4.0 Complete Tutorial Series [1080p]",
    size: "12.3 GB",
    seeders: 890,
    leechers: 120,
    uploadDate: "2024-05-18",
    category: "Education",
    magnetLink: "magnet:?xt=urn:btih:example2",
    uploader: "education_pro"
  },
  {
    id: "3",
    name: "Open Source Documentary Collection 2024",
    size: "8.9 GB",
    seeders: 445,
    leechers: 67,
    uploadDate: "2024-05-15",
    category: "Movies",
    magnetLink: "magnet:?xt=urn:btih:example3",
    uploader: "doc_collector"
  },
  {
    id: "4",
    name: "LibreOffice 7.6 Full Suite Multi-Language",
    size: "2.1 GB",
    seeders: 678,
    leechers: 23,
    uploadDate: "2024-05-12",
    category: "Software",
    magnetLink: "magnet:?xt=urn:btih:example4",
    uploader: "libre_team"
  },
  {
    id: "5",
    name: "Creative Commons Music Pack Vol.8",
    size: "1.8 GB",
    seeders: 234,
    leechers: 89,
    uploadDate: "2024-05-10",
    category: "Music",
    magnetLink: "magnet:?xt=urn:btih:example5",
    uploader: "cc_music"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("seeders");
  const [torrents, setTorrents] = useState<Torrent[]>(mockTorrents);
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Software", label: "Software" },
    { value: "Education", label: "Education" },
    { value: "Movies", label: "Movies" },
    { value: "Music", label: "Music" },
    { value: "Games", label: "Games" },
    { value: "Books", label: "Books" }
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "Category:", selectedCategory);
    
    let filteredTorrents = mockTorrents;
    
    if (searchQuery.trim()) {
      filteredTorrents = filteredTorrents.filter(torrent =>
        torrent.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      filteredTorrents = filteredTorrents.filter(torrent =>
        torrent.category === selectedCategory
      );
    }
    
    // Sort torrents
    filteredTorrents.sort((a, b) => {
      switch (sortBy) {
        case "seeders":
          return b.seeders - a.seeders;
        case "size":
          return parseFloat(b.size) - parseFloat(a.size);
        case "date":
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        default:
          return b.seeders - a.seeders;
      }
    });
    
    setTorrents(filteredTorrents);
    
    toast({
      title: "Search Complete",
      description: `Found ${filteredTorrents.length} torrents`,
    });
  };

  const handleDownload = (torrent: Torrent) => {
    console.log("Downloading torrent:", torrent.name);
    toast({
      title: "Magnet Link Copied",
      description: `Magnet link for "${torrent.name}" copied to clipboard`,
    });
    
    // In a real app, this would copy the magnet link to clipboard
    navigator.clipboard.writeText(torrent.magnetLink);
  };

  const formatUploadDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getSeedersColor = (seeders: number) => {
    if (seeders > 500) return "text-green-400";
    if (seeders > 100) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-2">
            <Download className="h-8 w-8" />
            TorrentFinder
          </h1>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <Input
                placeholder="Search torrents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-lg h-12"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-gray-700 border-gray-600 text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-600">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700 h-12 px-8">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-gray-400">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="seeders" className="text-white hover:bg-gray-600">Seeders</SelectItem>
                <SelectItem value="size" className="text-white hover:bg-gray-600">Size</SelectItem>
                <SelectItem value="date" className="text-white hover:bg-gray-600">Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-gray-400">
            {torrents.length} torrents found
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {torrents.map((torrent) => (
            <Card key={torrent.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 hover:text-green-400 cursor-pointer transition-colors">
                      {torrent.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {torrent.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Uploader: {torrent.uploader}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatUploadDate(torrent.uploadDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8">
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-gray-400">
                          <HardDrive className="h-4 w-4" />
                          <span>Size</span>
                        </div>
                        <div className="font-semibold text-blue-400">{torrent.size}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-gray-400">Seeders</div>
                        <div className={`font-bold ${getSeedersColor(torrent.seeders)}`}>
                          {torrent.seeders}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-gray-400">Leechers</div>
                        <div className="font-semibold text-orange-400">{torrent.leechers}</div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleDownload(torrent)}
                      className="bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Magnet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {torrents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No torrents found</div>
            <div className="text-gray-500 mt-2">Try adjusting your search terms or filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
