import React, { useState, useEffect } from "react";
import {View, Text, FlatList, ActivityIndicator, Image, StyleSheet,ScrollView, Linking, TouchableOpacity, Button} from "react-native";

export default function App() {
  // Estados para armazenar dados e controle de carregamento
  const [animes, setAnimes] = useState([]);
  const [sites, setSites] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Função para carregar Animes da API Jikan (HTTPS)
  async function carregarAnimes() {
    const resp = await fetch("https://api.jikan.moe/v4/top/anime?limit=3");
    const dados = await resp.json();
    const lista = dados.data.map((anime) => ({
      nome: anime.title, // título do anime
      imagem: anime.images.jpg.image_url, // imagem do anime
    }));
    setAnimes(lista);
  }

  // Função para carregar Sites Educativos (lista estática)
  function carregarSites() {
    const lista = [
      { nome: "Khan Academy", url: "https://www.khanacademy.org/" },
      { nome: "Coursera", url: "https://www.coursera.org/" },
      { nome: "Duolingo", url: "https://www.duolingo.com/" },
    ];
    setSites(lista);
  }

  // Função principal que carrega tudo e controla o spinner
  async function carregarTudo() {
    try {
      setCarregando(true); // mostra spinner
      await carregarAnimes();
      carregarSites();
    } catch (e) {
      alert("Erro ao carregar APIs!");
    } finally {
      setCarregando(false); // esconde spinner
    }
  }

  // useEffect: carrega os dados quando o app inicia
  useEffect(() => {
    carregarTudo();
  }, []);

  return (
    <ScrollView style={estilos.container}>
      {/* Lista de Animes */}
      <Text style={estilos.titulo}>Animes</Text>
      {carregando && <ActivityIndicator size="large" color="#FF0000" />}
      <FlatList
        horizontal
        data={animes}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => (
          <View style={estilos.card}>
            <Image source={{ uri: item.imagem }} style={estilos.imagem} />
            <Text style={estilos.nome}>{item.nome}</Text>
          </View>
        )}
      />

      {/* Lista de Sites Educativos */}
      <Text style={estilos.titulo}>Sites Educativos</Text>
      <FlatList
        horizontal
        data={sites}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={estilos.card}
            onPress={() => Linking.openURL(item.url)} // abre o site no navegador
          >
            <Text style={estilos.nome}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Espaço antes do botão */}
      <View style={{ height: 20 }} />

      {/* Botão para atualizar os dados */}
      <Button title="Atualizar" onPress={carregarTudo} color="#003366" />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: "black", // fundo escuro
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    color: "white", // texto branco para contraste
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 35,
    marginRight: 10,
    borderRadius: 10,
    elevation: 3,
    width: 140,
    height: 270,
  },
  imagem: {
    width: 140,
    height: 235,
    borderRadius: 10,
  },
  nome: {
    marginTop: 9,
    fontSize: 10,
    color: "#333",
    textAlign: "center",
  },
}); 