#!/usr/bin/env bash

set -u -e -o pipefail

export PYTHONIOENCODING=utf8;
CLEAN=false;
INSTALL=false;
BUILD=false;
PUBLISH=false;

##################
# Get value in json string given key.
# Arguments:
#   param1 - json string
#   param2 - key in json
# Returns:
#   string
##################
jsonExtractValue() {
    cat $1 | python -c "import sys, json; print json.load(sys.stdin)['${2}']";
}

##################
# Run yarn command on all node modules.
# Arguments:
#   param1 - yarn command
#   param2 - text to show
#   param3 - subdir containing packages
#   param4 - absolute path to the directory containing package.json
# Returns:
#   None
##################
scripts() {
    pushd "$4" > /dev/null;
    packageName=$(jsonExtractValue './package.json' 'name');
    echo "=== $2 ${packageName}"
    yarn $1 > /dev/null 2>&1 || true;
    for package in $3/* ; do
        if [[ -d "$(pwd)/${package}" && -f "$(pwd)/${package}/package.json" ]]; then
            scripts "$1" "$2" "$3" "$(pwd)/${package}"
            popd > /dev/null;
        fi
    done
}

##################
# Run yarn install on all node modules.
# Arguments:
#   param1 - absolute path to the directory containing package.json
# Returns:
#   None
##################
install() {
    scripts 'install' 'Installing' 'packages' $1;
}

##################
# Run yarn build on all node modules.
# Arguments:
#   param1 - absolute path to the directory containing package.json
# Returns:
#   None
##################
build() {
    scripts 'build' 'Building' 'packages' $1;
}

##################
# Run yarn clean on all node modules.
# Arguments:
#   param1 - absolute path to the directory containing package.json
# Returns:
#   None
##################
clean() {
    scripts 'clean' 'Cleaning' 'packages' $1;
}

publish() {
    scripts 'publish --new-version 1.0.0 --access public' 'Publishing' 'dist' $1;
}

for ARG in "$@"; do
  case "$ARG" in
    --clean)
      CLEAN=true;
      ;;
    --install)
      INSTALL=true;
      ;;
    --build)
      INSTALL=true;
      BUILD=true;
      ;;
    --publish)
      INSTALL=true;
      BUILD=true;
      PUBLISH=true;
      ;;
    *)
      echo "Unknown option $ARG."
      exit 1
      ;;
  esac
done

if [[ ${CLEAN} == true ]]; then
    clean $(pwd);
fi

if [[ ${INSTALL} == true ]]; then
    install $(pwd);
fi

if [[ ${BUILD} == true ]]; then
    build $(pwd);
fi

if [[ ${PUBLISH} == true ]]; then
    publish $(pwd);
fi