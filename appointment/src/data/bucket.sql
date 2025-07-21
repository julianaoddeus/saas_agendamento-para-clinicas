INSERT INTO storage.buckets (id, name, public)
VALUES ('doctors-diary01', 'doctors-diary01', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de imagens JPG na pasta public para usuários anônimos
CREATE POLICY "Allow anonymous upload of JPG images to public folder"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'doctors-diary01' AND
  (storage.extension(name) = 'jpg' OR storage.extension(name) = 'jpeg' OR storage.extension(name) = 'png') AND
  lower((storage.foldername(name))[1]) = 'public'
);

-- Política para permitir leitura pública
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'doctors-diary01');

-- Política para permitir delete (opcional, se necessário)
CREATE POLICY "Allow authenticated delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'doctors-diary01');