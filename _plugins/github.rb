require 'csv'
require 'uri'
require 'net/http'
require 'yaml'

module Jekyll
  module GitHub
    @@tuples = {}

    def self.fetch_csv(owner, repository, branch, filename)
      url = "https://raw.githubusercontent.com/#{owner}/#{repository}/#{branch}/#{filename}.csv"
      puts "Fetching #{url}"
      return @@tuples[url] if @@tuples.key?(url)

      begin
        uri = URI.parse(url)
        response = Net::HTTP.get_response(uri)

        if response.code == '200'
          csv_data = response.body.force_encoding('UTF-8')
          csv = CSV.parse(csv_data, headers: true)

          rows = []
          csv.each_with_index do |row, index|
            begin
              rows << yield(row)
            rescue CSV::MalformedCSVError => e
              puts "Error parsing CSV at line #{index + 2}: #{e.message}"
              next
            end
          end

          @@tuples[url] = rows
        else
          puts "Error making HTTP request: #{response.code}"
          @@tuples[url] = []
        end
      rescue => e
        puts "Error making HTTP request: #{e.message}"
        @@tuples[url] = []
      end

      @@tuples[url]
    end

    def self.get_pages()
      config = YAML.load_file('_config.yml')
      owner = config['github']['username']

      repository = "settings"
      branch = "main"
      filename = "pages"

      GitHub.fetch_csv(owner, repository, branch, filename) do |row|
        {
          'id' => row['id'],
          'collection_id' => row['collection_id']
        }
      end
    end

    def self.get_collections()
      config = YAML.load_file('_config.yml')
      owner = config['github']['username']

      repository = "settings"
      branch = "main"
      filename = "collections"

      GitHub.fetch_csv(owner, repository, branch, filename) do |row|
        {
          'id' => row['id'],
          'name' => row['name'],
          'description' => row['description'],
          'image' => "#{row['id']}/#{row['image']}"
        }
      end
    end

    def self.get_tracks()
      config = YAML.load_file('_config.yml')
      owner = config['github']['username']

      repository = "settings"
      branch = "main"
      filename = "tracks"

      GitHub.fetch_csv(owner, repository, branch, filename) do |row|
        {
          'title' => row['title'],
          'artist' => row['artist'],
          'album' => row['album'],
          'cover' => "#{row['collection_id']}/#{row['cover']}",
          'file' => "#{row['collection_id']}/#{row['file']}",
          'collection_id' => row['collection_id']
        }
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::GitHub)
