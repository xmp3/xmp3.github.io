module Jekyll
  class Build < Generator
    safe true

    def generate(site)
      site.data['collections'] = Jekyll::GitHub.get_data('collections')

      site.data['collections'].each do |row|
        site.pages << User.new(site, site.source, row.to_h)
        site.pages << Player.new(site, site.source, row.to_h)
      end
    end
  end

  class User < Page
    def initialize(site, base, row)
      @site = site
      @base = base
      @dir  = row['username']
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_pages'), 'user.md')
      self.data['title'] = row['username']
      self.data['username'] = row['username']
      self.data['filename'] = row['filename']
      self.data['name'] = row['name']
    end
  end

  class Player < Page
    def initialize(site, base, row)
      @site = site
      @base = base
      @dir  = "#{row['username']}/#{row['filename']}"
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_pages'), 'player.md')
      self.data['title'] = row['username']
      self.data['username'] = row['username']
      self.data['filename'] = row['filename']
      self.data['name'] = row['name']
    end
  end
end
