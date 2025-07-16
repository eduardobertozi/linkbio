import { useQuery } from '@tanstack/react-query';
import { Instagram, Youtube, Globe, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { linkbioService } from '@/services/linkbioService';
import { useToast } from '@/hooks/use-toast';

const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
};

export function Preview() {
  const { toast } = useToast();
  
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: linkbioService.getProfile,
  });

  const { data: links = [] } = useQuery({
    queryKey: ['links'],
    queryFn: linkbioService.getLinks,
  });

  const activeLinks = links.filter(link => link.isActive);

  const handleCopyLink = () => {
    const linkbioUrl = `linkbio.com/@${profile?.username}`;
    navigator.clipboard.writeText(linkbioUrl);
    toast({
      title: "Link copiado!",
      description: "O link do seu LinkBio foi copiado para a área de transferência.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-linkbio-text">Prévia</h1>
        <Button 
          onClick={handleCopyLink}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copiar Link
        </Button>
      </div>

      {/* Mobile Preview */}
      <div className="max-w-sm mx-auto">
        <Card className="bg-linkbio-card border-border p-6 rounded-3xl">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto mb-4 overflow-hidden">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl text-primary-foreground font-bold">
                    {profile?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-linkbio-text mb-1">
              @{profile?.username || 'usuario'}
            </h2>
            <p className="text-linkbio-text-muted">
              {profile?.displayName || 'Criador de conteúdo'}
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            {activeLinks.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap] || Globe;
              
              return (
                <Button
                  key={link.id}
                  variant="outline"
                  className="w-full h-14 bg-primary text-primary-foreground border-primary hover:bg-primary/90 justify-start font-medium text-base"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon className="w-5 h-5 mr-3" />
                    {link.title}
                  </a>
                </Button>
              );
            })}

            {activeLinks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-linkbio-text-muted">
                  Nenhum link ativo para exibir
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-border">
            <p className="text-sm text-linkbio-text-muted">
              linkbio.com/@{profile?.username || 'usuario'}
            </p>
          </div>
        </Card>
      </div>

      {/* Instructions */}
      <div className="max-w-sm mx-auto">
        <Card className="bg-linkbio-sidebar border-border p-4">
          <h3 className="font-medium text-linkbio-text mb-2">Como usar</h3>
          <ul className="text-sm text-linkbio-text-muted space-y-1">
            <li>• Adicione e gerencie seus links na aba "Meus Links"</li>
            <li>• Personalize as cores na aba "Personalização"</li>
            <li>• Copie o link e compartilhe com seus seguidores</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}