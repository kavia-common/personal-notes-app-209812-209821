import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { spacing, themeColors, cardStyle } from '../theme/theme';
import { Input, FAB, EmptyState } from '../components/UI';
import { Note } from '../types';
import { getAllNotes, searchNotes } from '../storage/notes';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'List'>;

const ListItem: React.FC<{ note: Note; onPress: () => void }> = ({ note, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.item}>
      <Text style={styles.itemTitle} numberOfLines={1}>{note.title}</Text>
      {note.content ? <Text style={styles.itemSnippet} numberOfLines={2}>{note.content}</Text> : null}
      <Text style={styles.itemMeta}>{new Date(note.updatedAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );
};

const ListScreen: React.FC<Props> = ({ navigation }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = query ? await searchNotes(query) : await getAllNotes();
    setNotes(data);
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    const t = setTimeout(load, 150); // smooth debounce
    return () => clearTimeout(t);
  }, [query, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Search notes..."
        style={{ marginBottom: spacing(3) }}
      />
      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          subtitle="Create your first note to get started."
          actionLabel="New Note"
          onAction={() => navigation.navigate('Edit')}
        />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: spacing(16) }}
          renderItem={({ item }) => (
            <ListItem note={item} onPress={() => navigation.navigate('View', { id: item.id })} />
          )}
        />
      )}

      <FAB onPress={() => navigation.navigate('Edit')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(4),
    backgroundColor: themeColors.background
  },
  item: {
    ...cardStyle,
    marginBottom: spacing(3)
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: themeColors.text,
    marginBottom: spacing(1)
  },
  itemSnippet: {
    fontSize: 14,
    color: themeColors.muted,
    marginBottom: spacing(2)
  },
  itemMeta: {
    fontSize: 12,
    color: themeColors.muted
  }
});

export default ListScreen;
