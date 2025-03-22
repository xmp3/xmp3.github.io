module Jekyll
  class Build < Generator
    safe true

    def generate(site)
      pages = Jekyll::GitHub.get_pages()
      collections = Jekyll::GitHub.get_collections()
      tracks = Jekyll::GitHub.get_tracks()

      # Agrupar páginas por ID (ex: "music", "jpop_citypop")
      pages_grouped = pages.group_by { |page| page['id'] }

      site.data['pages'] = pages_grouped.map do |page_id, pages_in_group|
        # Coletar coleções na ORDEM NATURAL (não ordenar)
        page_collections = pages_in_group.map do |page|
          collection = collections.find { |col| col['id'] == page['collection_id'] }
          next unless collection

          # Coletar tracks da coleção (sem IDs ainda)
          collection_tracks = tracks.select { |track| track['collection_id'] == collection['id'] }

          {
            'id' => page_id,
            'collection_id' => collection['id'],
            'name' => collection['name'],
            'description' => collection['description'],
            'image' => collection['image'],
            'tracks' => collection_tracks
          }
        end.compact

        # Gerar IDs únicos para TODAS as tracks da página (ordem natural)
        all_tracks = page_collections.flat_map { |col| col['tracks'] }
          .each_with_index.map { |track, i| track.merge('id' => i + 1) }

        # Atualizar as tracks de cada coleção com os IDs da página
        page_collections.each do |col|
          col['tracks'] = all_tracks.select { |t| t['collection_id'] == col['collection_id'] }
        end

        page_collections
      end.flatten

      # Gerar páginas estáticas
      site.data['pages'].group_by { |data| data['id'] }.each do |page_id, collections_data|
        # Gerar Section (as coleções serão ordenadas no template, mas os IDs já estão corretos)
        site.pages << Section.new(site, site.source, {
          'page_id' => page_id,
          'collections' => collections_data
        })

        # Extrair todas as tracks da página (já com IDs únicos)
        page_tracks = collections_data.flat_map { |col| col['tracks'] }

        # Gerar Players com as mesmas tracks
        collections_data.each do |collection|
          player_data = collection.merge('tracks' => page_tracks)
          site.pages << Player.new(site, site.source, player_data)
        end
      end

      site.pages << Home.new(site, site.source)
    end
  end

  class Home < Page
    def initialize(site, base)
      @site = site
      @base = base
      @dir  = '/'
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_pages'), 'index.md')
      self.data['title'] = 'xmp3'
    end
  end

  class Section < Page
    def initialize(site, base, data)
      @site = site
      @base = base
      @dir  = data['page_id']
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_pages'), 'section.md')
      self.data['title'] = data['page_id']
      self.data.merge!(data)
    end
  end

  class Player < Page
    def initialize(site, base, data)
      @site = site
      @base = base
      @dir  = "#{data['id']}/#{data['collection_id']}"
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_pages'), 'player.md')
      self.data['title'] = data['id']
      self.data.merge!(data)
    end
  end
end
