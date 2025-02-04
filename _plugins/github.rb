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

    def self.get_collections()
      config = YAML.load_file('_config.yml')
      owner = config['github']['username']
      repo_settings = config['github']['repositories']['settings']
      repo_collections = config['github']['repositories']['collections']
      repository = repo_settings['name']
      branch = repo_settings['branch']
      filename = repo_collections['settings']

      GitHub.fetch_csv(owner, repository, branch, filename) do |row|
        {
          'username' => row['username'],
          'filename' => row['filename'],
          'name' => row['name'],
          'description' => row['description'],
          'image' => "#{row['filename']}/#{row['image']}"
        }
      end
    end

    def self.get_tracks(username, filename)
      config = YAML.load_file('_config.yml')
      owner = config['github']['username']
      repository = config['github']['repositories']['collections']['name']

      GitHub.fetch_csv(owner, repository, username, filename) do |row|
        {
          'title' => row['title'],
          'artist' => row['artist'],
          'album' => row['album'],
          'cover' => "#{filename}/#{row['cover']}",
          'file' => "#{filename}/#{row['file']}"
        }
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::GitHub)
