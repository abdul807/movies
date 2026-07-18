import { supabase } from './supabase';

export interface Entry {
  id: number;
  title: string;
  type: 'MOVIE' | 'SERIES';
  status: 'COMPLETED' | 'WATCHING' | 'PLAN_TO_WATCH' | 'DROPPED';
  rating: number | null;
  genre: string | null;
  notes: string | null;
  poster_url: string | null;
  created_at: string;
}

// Get all entries
export async function getEntries() {
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Entries fetched:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
}

// Add entry with one image
export async function addEntry(entry: any, imageFile?: File) {
  try {
    console.log('Adding entry:', entry);
    console.log('Image file:', imageFile?.name);

    let posterUrl = null;

    // Upload image if provided
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      
      console.log('Uploading image:', fileName);

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('entry-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('entry-images')
        .getPublicUrl(fileName);

      posterUrl = urlData.publicUrl;
      console.log('Image URL:', posterUrl);
    }

    // Insert entry with poster_url
    const { data: entryData, error: entryError } = await supabase
      .from('entries')
      .insert({
        title: entry.title,
        type: entry.type,
        status: entry.status,
        rating: entry.rating || null,
        genre: entry.genre || null,
        notes: entry.notes || null,
        poster_url: posterUrl,
      })
      .select()
      .single();

    if (entryError) {
      console.error('Entry insert error:', entryError);
      throw entryError;
    }

    console.log('Entry created:', entryData);
    return entryData;
  } catch (error) {
    console.error('Error adding entry:', error);
    throw error;
  }
}

// Delete entry
export async function deleteEntry(id: number) {
  try {
    // First get the entry to delete the image
    const { data: entry, error: fetchError } = await supabase
      .from('entries')
      .select('poster_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the image from storage if it exists
    if (entry?.poster_url) {
      const fileName = entry.poster_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('entry-images')
          .remove([fileName]);
      }
    }

    // Delete the entry
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
}

// Get stats
export async function getStats() {
  try {
    const { data: entries, error } = await supabase
      .from('entries')
      .select('type, rating, genre');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    const totalMovies = entries?.filter(e => e.type === 'MOVIE').length || 0;
    const totalSeries = entries?.filter(e => e.type === 'SERIES').length || 0;

    // Favorite genre
    const genreCount: Record<string, number> = {};
    entries?.forEach(e => {
      if (e.genre) {
        genreCount[e.genre] = (genreCount[e.genre] || 0) + 1;
      }
    });
    
    let favoriteGenre = null;
    let maxCount = 0;
    for (const [genre, count] of Object.entries(genreCount)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteGenre = genre;
      }
    }

    // Average rating
    const rated = entries?.filter(e => e.rating !== null) || [];
    const averageRating = rated.length > 0
      ? rated.reduce((sum, e) => sum + (e.rating || 0), 0) / rated.length
      : null;

    return {
      totalMovies,
      totalSeries,
      favoriteGenre,
      averageRating: averageRating ? Number(averageRating.toFixed(1)) : null,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}



// Update entry
export async function updateEntry(id: number, entry: any, imageFile?: File) {
  try {
    console.log('Updating entry:', id, entry);
    console.log('Image file:', imageFile?.name);

    let posterUrl = entry.poster_url; // Keep existing poster if no new one

    // Upload new image if provided
    if (imageFile) {
      // Delete old image if exists
      if (entry.poster_url) {
        const oldFileName = entry.poster_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('entry-images')
            .remove([oldFileName]);
        }
      }

      const fileName = `${Date.now()}-${imageFile.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('entry-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('entry-images')
        .getPublicUrl(fileName);

      posterUrl = urlData.publicUrl;
      console.log('New image URL:', posterUrl);
    }

    // Update entry
    const { data, error } = await supabase
      .from('entries')
      .update({
        title: entry.title,
        type: entry.type,
        status: entry.status,
        rating: entry.rating || null,
        genre: entry.genre || null,
        notes: entry.notes || null,
        poster_url: posterUrl,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    console.log('Entry updated:', data);
    return data;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
}