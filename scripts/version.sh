
function update_package_version() {
   local version=$1
   local file_path=$2
   echo $version $file_path
   local file_content=$(cat $file_path)
   local new_file_content=$(echo "$file_content" | sed -E "s/\"version\": \"[0-9a-z\.-]+\"/\"version\": \"$version\"/")
   echo "$new_file_content" > $file_path
}

update_package_version $1 'packages/vue-next/package.json'
update_package_version $1 'packages/vue/package.json'
update_package_version $1 'packages/react/package.json'
update_package_version $1 'packages/svg/package.json'
