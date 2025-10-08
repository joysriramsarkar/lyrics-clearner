'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Music, Calendar, MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';

// বাংলা সংখ্যা কনভার্টার
function toBengaliNumber(num: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return bengaliDigits[parseInt(digit)];
    }
    return digit;
  }).join('');
}

interface Artist {
  id: string;
  name: string;
  biography?: string;
  birthDate?: string;
  genre?: string;
  country?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  songs: Array<{
    id: string;
    title: string;
    album?: string;
    releaseDate?: string;
  }>;
}

export default function ArtistManagement() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    birthDate: '',
    genre: '',
    country: '',
    image: ''
  });

  const genres = [
    'রবীন্দ্র সঙ্গীত',
    'নজরুল গীতি',
    'লোকসঙ্গীত',
    'আধুনিক গান',
    'ব্যান্ড সঙ্গীত',
    'ক্লাসিকাল',
    'ভাওয়াইয়া',
    'ভাটিয়ালি',
    'অন্যান্য'
  ];

  const countries = [
    'বাংলাদেশ',
    'ভারত',
    'পাকিস্তান',
    'যুক্তরাজ্য',
    'যুক্তরাষ্ট্র',
    'অন্যান্য'
  ];

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/artists');
      if (response.ok) {
        const data = await response.json();
        setArtists(data || []);
      } else {
        toast.error('শিল্পীদের তথ্য লোড করতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast.error('একটি ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingArtist ? `/api/artists/${editingArtist.id}` : '/api/artists';
      const method = editingArtist ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingArtist ? 'শিল্পী তথ্য আপডেট হয়েছে' : 'নতুন শিল্পী যোগ হয়েছে');
        setIsDialogOpen(false);
        setEditingArtist(null);
        setFormData({
          name: '',
          biography: '',
          birthDate: '',
          genre: '',
          country: '',
          image: ''
        });
        fetchArtists();
      } else {
        toast.error('অপারেশন ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error saving artist:', error);
      toast.error('একটি ত্রুটি ঘটেছে');
    }
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      biography: artist.biography || '',
      birthDate: artist.birthDate ? new Date(artist.birthDate).toISOString().split('T')[0] : '',
      genre: artist.genre || '',
      country: artist.country || '',
      image: artist.image || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই শিল্পীকে মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const response = await fetch(`/api/artists/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('শিল্পী মুছে ফেলা হয়েছে');
        fetchArtists();
      } else {
        toast.error('মুছে ফেলতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('একটি ত্রুটি ঘটেছে');
    }
  };

  const openAddDialog = () => {
    setEditingArtist(null);
    setFormData({
      name: '',
      biography: '',
      birthDate: '',
      genre: '',
      country: '',
      image: ''
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">শিল্পী ব্যবস্থাপনা</h2>
          <p className="text-gray-600">শিল্পীদের তথ্য যোগ, সম্পাদনা এবং মুছে ফেলুন</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              নতুন শিল্পী যোগ করুন
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArtist ? 'শিল্পী তথ্য সম্পাদনা করুন' : 'নতুন শিল্পী যোগ করুন'}
              </DialogTitle>
              <DialogDescription>
                {editingArtist ? 'শিল্পীর তথ্য আপডেট করুন' : 'নতুন শিল্পীর তথ্য যোগ করুন'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">শিল্পীর নাম *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">জন্ম তারিখ</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre">ধরন</Label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="ধরন নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">দেশ</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="দেশ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">ছবির URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <Label htmlFor="biography">জীবনী</Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  rows={4}
                  placeholder="শিল্পীর জীবনী..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  বাতিল
                </Button>
                <Button type="submit">
                  {editingArtist ? 'আপডেট করুন' : 'যোগ করুন'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Artists Grid */}
      {artists.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              কোনো শিল্পী পাওয়া যায়নি
            </h3>
            <p className="text-gray-500 mb-4">
              প্রথম শিল্পী যোগ করতে উপরের বোতামে ক্লিক করুন
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Card key={artist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {artist.image ? (
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{artist.name}</CardTitle>
                      {artist.genre && (
                        <Badge variant="secondary" className="text-xs">
                          {artist.genre}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(artist)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(artist.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {artist.birthDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(artist.birthDate).toLocaleDateString('bn-BD')}
                  </div>
                )}
                {artist.country && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {artist.country}
                  </div>
                )}
                {artist.biography && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {artist.biography}
                  </p>
                )}
                {artist.songs.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Music className="h-4 w-4" />
                      {toBengaliNumber(artist.songs.length)} টি গান
                    </div>
                    <div className="mt-2 space-y-1">
                      {artist.songs.slice(0, 3).map((song) => (
                        <div key={song.id} className="text-xs text-gray-500">
                          • {song.title}
                        </div>
                      ))}
                      {artist.songs.length > 3 && (
                        <div className="text-xs text-gray-400">
                          আরও {toBengaliNumber(artist.songs.length - 3)} টি গান...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}