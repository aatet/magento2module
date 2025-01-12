<?php
/**
 * PIT Solutions
 *
 * NOTICE OF LICENSE
 * This source file is licenced under Webshop Extensions software license.
 * Once you have purchased the software with PIT Solutions AG or one of its
 * authorised resellers and provided that you comply with the conditions of this contract,
 * PIT Solutions AG grants you a non-exclusive license, unlimited in time for the usage of
 * the software in the manner of and for the purposes specified in the documentation according
 * to the subsequent regulations.
 *
 * @category Pits
 * @package  Pits_VoiceSearch
 * @author   Pit Solutions Pvt. Ltd.
 * @copyright Copyright (c) 2022 PIT Solutions AG. (www.pitsolutions.ch)
 * @license https://www.webshopextension.com/en/licence-agreement/
 */

namespace Pits\VoiceSearch\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\Locale\Resolver;

/**
 * Class VoiceSearch
 *
 * View model class for voice search locale input
 */
class VoiceSearch implements ArgumentInterface
{
    /**
     * @var Resolver $_store
     */
    protected $_store;

    /**
     * VoiceSearch constructor.
     *
     * @param Resolver $store
     */
    public function __construct(
        Resolver $store
    ) {
        $this->_store = $store;
    }

    /**
     * Return locale of current store
     *
     * @return string
     */
    public function getLocale(): string
    {
        return $this->_store->getLocale();
    }
}
