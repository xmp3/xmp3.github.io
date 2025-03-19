module Jekyll
  class Build < Generator
    safe true

    def generate(site)
      pages = Jekyll::GitHub.get_pages()
      collections = Jekyll::GitHub.get_collections()
      tracks = Jekyll::GitHub.get_tracks()

      site.data['pages'] = pages.map do |page|
        collection = collections.find { |col| col['id'] == page['collection_id'] }

        if collection.nil?
          puts "Warning: no collection found for collection_id: #{page['collection_id']}"
          next
        end

        collection_tracks = tracks.select { |track| track['collection_id'] == page['collection_id'] }
        {
          'id' => page['id'],
          'collection_id' => page['collection_id'],
          'name' => collection['name'],
          'description' => collection['description'],
          'image' => collection['image'],
          'tracks' => collection_tracks
        }
      end

      pages_grouped = site.data['pages'].group_by { |row| row['id'] }

      pages_grouped.each do |page_id, collections|
        site.pages << Section.new(site, site.source, {
          'page_id' => page_id,
          'collections' => collections
        })

        collections.each do |collection|
          site.pages << Player.new(site, site.source, collection)
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
