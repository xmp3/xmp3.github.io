require 'csv'
require 'uri'
require 'net/http'
require 'yaml'

module Jekyll
  module GitHub
    @@tuples = {}

    def self.fetch_csv(repo_config, username, filename)
      url = "https://raw.githubusercontent.com/#{username}/#{repo_config['repository']}/#{repo_config['branch']}/#{filename}.csv"
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

    def self.get_data(filename)
      config = YAML.load_file('_config.yml')
      username = config['github']['username']
      repo_config = config['github']['data']

      GitHub.fetch_csv(repo_config, username, filename) do |row|
        {
          'username' => row['username'],
          'filename' => row['filename'],
          'name' => row['name'],
          'description' => row['description'],
          'image' => row['image']
        }
      end
    end

    def get_collection(data)
      config = YAML.load_file('_config.yml')
      repo_config = config['github']['collections']

      username, filename = data.split(',')

      GitHub.fetch_csv(repo_config, username, filename) do |row|
        {
          'title' => row['title'],
          'artist' => row['artist'],
          'cover' => row['cover'],
          'file' => row['file']
        }
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::GitHub)
