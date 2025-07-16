import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Instagram, Youtube, Globe, Grip, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { linkbioService } from '@/services/linkbioService';
import { Link } from '@/types';
import { useToast } from '@/hooks/use-toast';

const iconMap = {
  instagram: Instagram,
  youtube: Youtube,
  globe: Globe,
};

const iconOptions = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'globe', label: 'Website', icon: Globe },
];

export function LinkManager() {
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: linkbioService.getLinks,
  });

  const updateLinkMutation = useMutation({
    mutationFn: ({ linkId, updates }: { linkId: string; updates: Partial<Link> }) =>
      linkbioService.updateLink(linkId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast({
        title: "Link atualizado",
        description: "O link foi atualizado com sucesso.",
      });
    },
  });

  const createLinkMutation = useMutation({
    mutationFn: (linkData: Omit<Link, 'id'>) =>
      linkbioService.createLink(linkData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      setIsDialogOpen(false);
      setEditingLink(null);
      toast({
        title: "Link criado",
        description: "O novo link foi criado com sucesso.",
      });
    },
  });

  const handleToggleActive = (link: Link) => {
    updateLinkMutation.mutate({
      linkId: link.id,
      updates: { isActive: !link.isActive }
    });
  };

  const handleSaveLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const url = formData.get('url') as string;
    const icon = formData.get('icon') as string;

    if (editingLink) {
      updateLinkMutation.mutate({
        linkId: editingLink.id,
        updates: { title, url, icon }
      });
    } else {
      createLinkMutation.mutate({
        title,
        url,
        icon,
        isActive: true,
        order: links.length + 1
      });
    }
    setIsDialogOpen(false);
    setEditingLink(null);
  };

  const openDialog = (link?: Link) => {
    setEditingLink(link || null);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-linkbio-card rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-linkbio-text">Meus Links</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => openDialog()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Link
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-linkbio-card border-border">
            <DialogHeader>
              <DialogTitle className="text-linkbio-text">
                {editingLink ? 'Editar Link' : 'Adicionar Novo Link'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveLink} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-linkbio-text">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingLink?.title || ''}
                  placeholder="Ex: Instagram"
                  className="bg-linkbio-sidebar border-border text-linkbio-text"
                />
              </div>
              <div>
                <Label htmlFor="url" className="text-linkbio-text">URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  defaultValue={editingLink?.url || ''}
                  placeholder="https://..."
                  className="bg-linkbio-sidebar border-border text-linkbio-text"
                />
              </div>
              <div>
                <Label htmlFor="icon" className="text-linkbio-text">Ícone</Label>
                <Select name="icon" defaultValue={editingLink?.icon || 'globe'}>
                  <SelectTrigger className="bg-linkbio-sidebar border-border text-linkbio-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-linkbio-card border-border">
                    {iconOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value} className="text-linkbio-text">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {editingLink ? 'Salvar Alterações' : 'Criar Link'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {links.map((link) => {
          const Icon = iconMap[link.icon as keyof typeof iconMap] || Globe;
          
          return (
            <Card key={link.id} className="bg-linkbio-card border-border p-4">
              <div className="flex items-center gap-4">
                <div className="cursor-grab">
                  <Grip className="w-5 h-5 text-linkbio-text-muted" />
                </div>
                
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 bg-linkbio-sidebar rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-linkbio-text">{link.title}</h3>
                    <p className="text-sm text-linkbio-text-muted truncate">{link.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={link.isActive}
                    onCheckedChange={() => handleToggleActive(link)}
                    className="data-[state=checked]:bg-primary"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialog(link)}
                    className="text-linkbio-text-muted hover:text-linkbio-text hover:bg-linkbio-sidebar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {links.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-linkbio-card rounded-full flex items-center justify-center mx-auto mb-4">
            <Link2 className="w-8 h-8 text-linkbio-text-muted" />
          </div>
          <h3 className="text-lg font-medium text-linkbio-text mb-2">Nenhum link ainda</h3>
          <p className="text-linkbio-text-muted mb-4">Comece adicionando seu primeiro link</p>
          <Button 
            onClick={() => openDialog()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Link
          </Button>
        </div>
      )}
    </div>
  );
}