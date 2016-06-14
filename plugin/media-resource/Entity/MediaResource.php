<?php

namespace Innova\MediaResourceBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * MediaResource Entity.
 *
 * @ORM\Table(name="media_resource")
 * @ORM\Entity
 */
class MediaResource extends AbstractResource
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     * @Assert\NotBlank
     */
    protected $name;

    /**
     * @var medias
     *
     * @ORM\OneToMany(targetEntity="Innova\MediaResourceBundle\Entity\Media", cascade={"remove", "persist"}, mappedBy="mediaResource")
     */
    protected $medias;

    /**
     * @ORM\OneToMany(targetEntity="Innova\MediaResourceBundle\Entity\Region", cascade={"remove", "persist"}, mappedBy="mediaResource")
     */
    protected $regions;

    /**
     * @ORM\OneToOne(targetEntity="Innova\MediaResourceBundle\Entity\Options", cascade={"remove", "persist"})
     */
    protected $options;

   /**
    * Not mapped, only used to handle file upload.
    */
   public $file;

    public function __construct()
    {
        $this->medias = new ArrayCollection();
        $this->regions = new ArrayCollection();
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name.
     *
     * @param string $name
     *
     * @return Exercise
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    public function addMedia(Media $m)
    {
        $this->medias[] = $m;

        return $this;
    }

    public function removeMedia(Media $m)
    {
        $this->medias->removeElement($m);

        return $this;
    }

    public function getMedias()
    {
        return $this->medias;
    }

    public function addRegion(Region $region)
    {
        $this->regions[] = $region;

        return $this;
    }

    public function removeRegion(Region $region)
    {
        $this->regions->removeElement($region);

        return $this;
    }

    public function getRegions()
    {
        return $this->regions;
    }

    public function getFile()
    {
        return $this->file;
    }

    public function setFile(UploadedFile $file)
    {
        $this->file = $file;

        return $this;
    }

    public function setOptions(Options $options)
    {
        $this->options = $options;

        return $this;
    }

    public function getOptions()
    {
        return $this->options;
    }

    /**
     * Wrapper to access workspace of the MediaResource.
     *
     * @return \Claroline\CoreBundle\Entity\Workspace\Workspace
     */
    public function getWorkspace()
    {
        $workspace = null;
        if (!empty($this->resourceNode)) {
            $workspace = $this->resourceNode->getWorkspace();
        }

        return $workspace;
    }
}