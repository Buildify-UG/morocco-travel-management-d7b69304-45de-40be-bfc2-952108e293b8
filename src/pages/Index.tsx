import { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, Star, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tour {
  id: string;
  name: string;
  destination: string;
  duration: number;
  price: number;
  rating: number;
  description: string;
  image: string;
  maxGuests: number;
  highlights: string[];
}

const SAMPLE_TOURS: Tour[] = [
  {
    id: '1',
    name: 'Sahara Desert Adventure',
    destination: 'Merzouga',
    duration: 3,
    price: 299,
    rating: 4.8,
    description: 'Experience the golden dunes of the Sahara with camel trekking and traditional Berber camp overnight.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    maxGuests: 12,
    highlights: ['Camel trekking', 'Berber camp', 'Sunset views', 'Traditional dinner']
  },
  {
    id: '2',
    name: 'Blue City & Atlas Mountains',
    destination: 'Chefchaouen & Ifrane',
    duration: 4,
    price: 349,
    rating: 4.9,
    description: 'Explore the enchanting blue-painted streets of Chefchaouen and trek through the Atlas Mountains.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
    maxGuests: 15,
    highlights: ['Blue medina', 'Mountain hikes', 'Local markets', 'Berber villages']
  },
  {
    id: '3',
    name: 'Marrakech Imperial City',
    destination: 'Marrakech',
    duration: 2,
    price: 199,
    rating: 4.7,
    description: 'Discover the vibrant markets, historic palaces, and stunning gardens of Morocco\'s red city.',
    image: 'https://images.unsplash.com/photo-1504681869696-d977e22a8e5f?w=800&h=600&fit=crop',
    maxGuests: 20,
    highlights: ['Jemaa el-Fnaa', 'Bahia Palace', 'Majorelle Garden', 'Spice markets']
  },
  {
    id: '4',
    name: 'Coastal Escape - Essaouira',
    destination: 'Essaouira',
    duration: 2,
    price: 179,
    rating: 4.6,
    description: 'Relax on pristine beaches and explore the charming seaside medina of Essaouira.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    maxGuests: 18,
    highlights: ['Beach relaxation', 'Medina walk', 'Fresh seafood', 'Harbor views']
  }
];

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [tours, setTours] = useState<Tour[]>(SAMPLE_TOURS);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [newTour, setNewTour] = useState<Partial<Tour>>({});
  const [activeTab, setActiveTab] = useState('tours');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail) {
      setAdminEmail(loginEmail);
      setIsLoggedIn(true);
      setLoginEmail('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminEmail('');
  };

  const handleAddTour = () => {
    if (newTour.name && newTour.destination && newTour.price) {
      const tour: Tour = {
        id: Date.now().toString(),
        name: newTour.name,
        destination: newTour.destination,
        duration: newTour.duration || 1,
        price: newTour.price,
        rating: 4.5,
        description: newTour.description || '',
        image: newTour.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        maxGuests: newTour.maxGuests || 10,
        highlights: newTour.highlights || []
      };
      setTours([...tours, tour]);
      setNewTour({});
    }
  };

  const handleDeleteTour = (id: string) => {
    setTours(tours.filter(t => t.id !== id));
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
  };

  const handleUpdateTour = () => {
    if (editingTour) {
      setTours(tours.map(t => t.id === editingTour.id ? editingTour : t));
      setEditingTour(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="border-b border-amber-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-amber-900">Morocco Tours</h1>
          </div>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-amber-700">
                <p className="font-semibold">{adminEmail}</p>
                <p className="text-amber-600">Admin</p>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Admin Login</DialogTitle>
                  <DialogDescription>Enter your email to manage tours</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Login</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoggedIn ? (
          // Admin Dashboard
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="tours">Tours</TabsTrigger>
              <TabsTrigger value="add">Add Tour</TabsTrigger>
            </TabsList>

            <TabsContent value="tours" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-amber-900">Manage Tours</h2>
                <p className="text-amber-700">{tours.length} tours</p>
              </div>
              <div className="grid gap-4">
                {tours.map((tour) => (
                  <Card key={tour.id} className="border-amber-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-amber-900">{tour.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <MapPin className="w-4 h-4" />
                            {tour.destination}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTour(tour)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Tour</DialogTitle>
                              </DialogHeader>
                              {editingTour && (
                                <div className="space-y-4">
                                  <Input
                                    value={editingTour.name}
                                    onChange={(e) => setEditingTour({...editingTour, name: e.target.value})}
                                    placeholder="Tour name"
                                  />
                                  <Input
                                    value={editingTour.price}
                                    onChange={(e) => setEditingTour({...editingTour, price: Number(e.target.value)})}
                                    type="number"
                                    placeholder="Price"
                                  />
                                  <Textarea
                                    value={editingTour.description}
                                    onChange={(e) => setEditingTour({...editingTour, description: e.target.value})}
                                    placeholder="Description"
                                  />
                                  <Button onClick={handleUpdateTour} className="w-full bg-orange-600 hover:bg-orange-700">
                                    Save Changes
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTour(tour.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-amber-700">{tour.duration} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-amber-700">${tour.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-amber-700">Max {tour.maxGuests}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-amber-700">{tour.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add" className="space-y-6">
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-900">Create New Tour</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Tour name"
                    value={newTour.name || ''}
                    onChange={(e) => setNewTour({...newTour, name: e.target.value})}
                  />
                  <Input
                    placeholder="Destination"
                    value={newTour.destination || ''}
                    onChange={(e) => setNewTour({...newTour, destination: e.target.value})}
                  />
                  <Input
                    placeholder="Duration (days)"
                    type="number"
                    value={newTour.duration || ''}
                    onChange={(e) => setNewTour({...newTour, duration: Number(e.target.value)})}
                  />
                  <Input
                    placeholder="Price ($)"
                    type="number"
                    value={newTour.price || ''}
                    onChange={(e) => setNewTour({...newTour, price: Number(e.target.value)})}
                  />
                  <Input
                    placeholder="Max guests"
                    type="number"
                    value={newTour.maxGuests || ''}
                    onChange={(e) => setNewTour({...newTour, maxGuests: Number(e.target.value)})}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newTour.description || ''}
                    onChange={(e) => setNewTour({...newTour, description: e.target.value})}
                  />
                  <Button onClick={handleAddTour} className="w-full bg-orange-600 hover:bg-orange-700">
                    Add Tour
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Public Tours View
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-amber-900 mb-4">Discover Morocco</h2>
              <p className="text-xl text-amber-700 max-w-2xl mx-auto">
                Experience the magic of Morocco with our carefully curated tours. From desert adventures to coastal escapes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden border-amber-200 hover:shadow-lg transition-shadow">
                  <img src={tour.image} alt={tour.name} className="w-full h-64 object-cover" />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-amber-900">{tour.name}</CardTitle>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                        <span className="text-sm font-semibold text-yellow-700">{tour.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {tour.destination}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-amber-800">{tour.description}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-amber-900">{tour.duration} days</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-amber-900">${tour.price}</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <Users className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-amber-900">Max {tour.maxGuests}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-amber-900">Highlights:</p>
                      <div className="flex flex-wrap gap-2">
                        {tour.highlights.map((highlight, i) => (
                          <span key={i} className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-amber-700">
          <p>© 2024 Morocco Tours. All rights reserved.</p>
          <p className="text-sm mt-2">Discover the beauty of Morocco with our expert guides.</p>
        </div>
      </footer>
    </div>
  );
}
