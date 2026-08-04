{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_24
    pkgs.openssl
    pkgs.prisma # The pre-patched Nix CLI
  ];

  shellHook = ''
    # 1. Nuke npm's ability to download Prisma engines
    export PRISMA_SKIP_DOWNLOAD=1 
    
    # 2. Tell the Prisma CLI where the schema engine is for generation/migrations
    export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
    
    # 3. Prisma 7 Client is Rust-free, but CLI still needs engine hashes sometimes
    # PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING can help on NixOS if hashes mismatch
    export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
  '';
}
