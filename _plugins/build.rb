module Jekyll
  class Build < Generator
    safe true

    def generate(site)
      site.data['collections'] = Jekyll::GitHub.get_collections()
      users = site.data['collections'].group_by { |row| row['username'] }

      users.each do |username, collections|
        collections = collections.map do |collection|
          collections = collection.to_h
          collections['tracks'] = Jekyll::GitHub.get_tracks(username, collection['filename'])
          collections
        end

        site.pages << User.new(site, site.source, {
          'username' => username,
          'collections' => collections
        })

        collections.each do |collection|
          site.pages << Player.new(site, site.source, collection)
        end
      end

    end
  end

  class User < Page
    def initialize(site, base, data)
      @site = site
      @base = base
      @dir  = data['username']
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_pages'), 'user.md')
      self.data['title'] = data['username']
      self.data.merge!(data)
    end
  end

  class Player < Page
    def initialize(site, base, data)
      @site = site
      @base = base
      @dir  = "#{data['username']}/#{data['filename']}"
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_pages'), 'player.md')
      self.data['title'] = data['username']
      self.data.merge!(data)
    end
  end
end
